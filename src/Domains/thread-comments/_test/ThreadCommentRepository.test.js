const ThreadCommentRepository = require('../ThreadCommentRepository');

describe('ThreadCommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const threadCommentRepository = new ThreadCommentRepository();

    await expect(
      threadCommentRepository.addThreadComment({}),
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      threadCommentRepository.deleteThreadComment(1),
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      threadCommentRepository.getThreadCommentById(1),
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      threadCommentRepository.getThreadCommentByThreadId(1),
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      threadCommentRepository.verifyThreadCommentOwner({}),
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      threadCommentRepository.verifyThreadCommentAvailability(1),
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
