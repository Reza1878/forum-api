/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const Thread = require('../../../Domains/threads/entities/Thread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'Thread 1',
      body: 'Body thread 1',
      owner: 'user-1',
    };
    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'Thread 1',
      body: 'Body thread 1',
      owner: 'user-1',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedThread({
          id: 'thread-123',
          title: 'Thread 1',
          body: 'Body thread 1',
          owner: 'user-1',
        }),
      ),
    );

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await getThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new Thread(useCasePayload),
    );
  });
});
