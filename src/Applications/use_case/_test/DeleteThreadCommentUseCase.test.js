const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread-comments/ThreadCommentRepository');

describe('DeleteThreadCommentUseCase', () => {
  it('should orchestrating the delete thread comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      id: 'comment-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });
    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyThreadCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.deleteThreadComment = jest
      .fn()
      .mockImplementation(async () => {
        await mockThreadCommentRepository.verifyThreadCommentOwner({
          id: useCasePayload.id,
          owner: useCasePayload.owner,
        });
        return Promise.resolve();
      });

    await deleteThreadCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockThreadCommentRepository.deleteThreadComment).toBeCalledWith({
      id: useCasePayload.id,
    });
    expect(mockThreadCommentRepository.verifyThreadCommentOwner).toBeCalledWith(
      {
        id: useCasePayload.id,
        owner: useCasePayload.owner,
      },
    );
  });
});
