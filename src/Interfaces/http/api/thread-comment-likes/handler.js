const DislikeThreadCommentUseCase = require('../../../../Applications/use_case/DislikeThreadCommentUseCase');
const LikeThreadCommentUseCase = require('../../../../Applications/use_case/LikeThreadCommentUseCase');
const VerifyThreadCommentLikeUseCase = require('../../../../Applications/use_case/VerifyThreadCommentLikeUseCase');
const ThreadCommentLike = require('../../../../Domains/thread-comment-likes/entities/ThreadCommentLike');

class ThreadCommentLikesHandler {
  constructor(container) {
    this._container = container;

    this.putThreadCommentLikeHandler =
      this.putThreadCommentLikeHandler.bind(this);
  }

  async putThreadCommentLikeHandler(request) {
    const { userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const likeThreadCommentUsecase = this._container.getInstance(
      LikeThreadCommentUseCase.name,
    );
    const verifyThreadCommentUseCase = this._container.getInstance(
      VerifyThreadCommentLikeUseCase.name,
    );
    const dislikeThreadCommentUseCase = this._container.getInstance(
      DislikeThreadCommentUseCase.name,
    );
    const useCasePayload = new ThreadCommentLike({
      threadId,
      threadCommentId: commentId,
      userId,
    });

    const isCommentLiked = await verifyThreadCommentUseCase.execute(
      useCasePayload,
    );

    if (isCommentLiked) {
      await dislikeThreadCommentUseCase.execute(useCasePayload);
    } else {
      await likeThreadCommentUsecase.execute(useCasePayload);
    }

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadCommentLikesHandler;
