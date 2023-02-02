const ThreadCommentLike = require('../../Domains/thread-comment-likes/entities/ThreadCommentLike');

class DislikeThreadCommentUseCase {
  constructor({
    threadRepository,
    threadCommentRepository,
    threadCommentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentLikeRepository = threadCommentLikeRepository;
  }

  async execute(useCasePayload) {
    const threadCommentLike = new ThreadCommentLike(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(
      threadCommentLike.threadId,
    );
    await this._threadCommentRepository.verifyThreadCommentAvailability(
      threadCommentLike.threadCommentId,
    );
    await this._threadCommentLikeRepository.deleteThreadCommentLike(
      useCasePayload,
    );
  }
}

module.exports = DislikeThreadCommentUseCase;
