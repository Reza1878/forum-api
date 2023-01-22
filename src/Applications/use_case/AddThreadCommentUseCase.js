const ThreadComment = require('../../Domains/thread-comments/entities/ThreadComment');

class AddThreadCommentUseCase {
  constructor({ threadCommentRepository, threadRepository }) {
    this._threadCommentRepository = threadCommentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const threadComment = new ThreadComment(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(
      threadComment.threadId,
    );
    return this._threadCommentRepository.addThreadComment(threadComment);
  }
}

module.exports = AddThreadCommentUseCase;
