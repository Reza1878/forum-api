const AddedThreadComment = require('../../../Domains/thread-comments/entities/AddedThreadComment');
const ThreadCommentRepository = require('../../../Domains/thread-comments/ThreadCommentRepository');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');
const ThreadComment = require('../../../Domains/thread-comments/entities/ThreadComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddThreadCommentUseCase', () => {
  it('should orchestrating the add thread comment action correctly', async () => {
    const useCasePayload = {
      content: 'Komentar',
      owner: 'user-123',
      threadId: 'thread-123',
    };
    const expectedThreadComment = new AddedThreadComment({
      content: 'Komentar',
      id: 'comment-123',
      owner: 'user-123',
    });

    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.addThreadComment = jest.fn().mockImplementation(
      () =>
        // eslint-disable-next-line implicit-arrow-linebreak
        Promise.resolve(
          new AddedThreadComment({
            content: 'Komentar',
            id: 'comment-123',
            owner: 'user-123',
          }),
        ),
      // eslint-disable-next-line function-paren-newline
    );

    const getThreadCommentUseCase = new AddThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedThreadComment = await getThreadCommentUseCase.execute(
      useCasePayload,
    );

    expect(addedThreadComment).toStrictEqual(expectedThreadComment);
    expect(mockThreadCommentRepository.addThreadComment).toBeCalledWith(
      new ThreadComment({
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        threadId: useCasePayload.threadId,
      }),
    );
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      useCasePayload.threadId,
    );
  });
});
