const DeleteThreadComment = require('../../Domains/thread-comments/entities/DeleteThreadComment');

class DeleteThreadCommentUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload) {
    const deleteThreadComment = new DeleteThreadComment(useCasePayload);

    await this._threadRepository.verifyThreadAvailability(
      deleteThreadComment.threadId,
    );
    await this._threadCommentRepository.verifyThreadCommentOwner({
      id: deleteThreadComment.id,
      owner: deleteThreadComment.owner,
    });
    await this._threadCommentRepository.deleteThreadComment({
      id: deleteThreadComment.id,
    });
  }
}

module.exports = DeleteThreadCommentUseCase;
