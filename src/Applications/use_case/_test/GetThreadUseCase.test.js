const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadRepositoryPostgres = require('../../../Infrastructures/repository/ThreadRepositoryPostgres');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const useCasePayload = {
      id: 'thread-123',
    };
    const mockThreadRepository = new ThreadRepositoryPostgres({}, () => '123');
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(
      async () =>
        // eslint-disable-next-line implicit-arrow-linebreak
        Promise.resolve(
          new ThreadDetail({
            id: 'thread-123',
            title: 'title',
            body: 'body',
            date: '2022-12-12',
            username: 'test',
            comments: [],
          }),
        ),
      // eslint-disable-next-line function-paren-newline
    );
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    const thread = await getThreadUseCase.execute(useCasePayload);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.id,
    );
    expect(thread.id).toEqual(useCasePayload.id);
    expect(thread.title).toEqual('title');
    expect(thread.body).toEqual('body');
    expect(thread.date).toEqual('2022-12-12');
    expect(thread.username).toEqual('test');
    expect(thread.comments).toHaveLength(0);
  });

  it('should orchestrating the get thread action correctly', async () => {
    const useCasePayload = {
      id: 'thread-123',
    };
    const mockThreadRepository = new ThreadRepositoryPostgres({}, () => '123');
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(
      async () =>
        // eslint-disable-next-line implicit-arrow-linebreak
        Promise.resolve(
          new ThreadDetail({
            id: 'thread-123',
            title: 'title',
            body: 'body',
            date: '2022-12-12',
            username: 'test',
            comments: [
              {
                date: '2022-12-12',
                username: 'john',
                id: 'comment-123',
                content: 'komentar 1',
              },
              {
                date: '2022-12-12',
                username: 'doe',
                id: 'comment-124',
                content: 'komentar 2',
              },
            ],
          }),
        ),
      // eslint-disable-next-line function-paren-newline
    );
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    const thread = await getThreadUseCase.execute(useCasePayload);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.id,
    );
    expect(thread.id).toEqual(useCasePayload.id);
    expect(thread.title).toEqual('title');
    expect(thread.body).toEqual('body');
    expect(thread.date).toEqual('2022-12-12');
    expect(thread.username).toEqual('test');
    expect(thread.comments).toHaveLength(2);
    expect(thread.comments[0].id).toEqual('comment-123');
    expect(thread.comments[0].username).toEqual('john');
    expect(thread.comments[0].content).toEqual('komentar 1');
    expect(typeof thread.comments[0].date).toBe('string');
    expect(thread.comments[0].date).toEqual('2022-12-12');
    expect(thread.comments[1].id).toEqual('comment-124');
    expect(thread.comments[1].username).toEqual('doe');
    expect(thread.comments[1].content).toEqual('komentar 2');
    expect(typeof thread.comments[1].date).toBe('string');
    expect(thread.comments[1].date).toEqual('2022-12-12');
  });
  it('should throw error when payload not contain needed property', async () => {
    const useCasePayload = {};
    const mockThreadRepository = new ThreadRepositoryPostgres({}, () => '123');

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    await expect(getThreadUseCase.execute(useCasePayload)).rejects.toThrowError(
      new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY'),
    );
  });
  it('should throw error when payload not meet data type specification', async () => {
    const useCasePayload = { id: 123 };
    const mockThreadRepository = new ThreadRepositoryPostgres({}, () => '123');

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    await expect(getThreadUseCase.execute(useCasePayload)).rejects.toThrowError(
      new Error('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'),
    );
  });
});
