const ThreadCommentLikeRepository = require('../ThreadCommentLikeRepository');

describe('ThreadCommentLikeRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const threadCommentLikeRepository = new ThreadCommentLikeRepository();

    await expect(
      threadCommentLikeRepository.addThreadCommentLike({}),
    ).rejects.toThrowError(
      'THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(
      threadCommentLikeRepository.deleteThreadCommentLike({}),
    ).rejects.toThrowError(
      'THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(
      threadCommentLikeRepository.verifyCommentLikes({}),
    ).rejects.toThrowError(
      'THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
