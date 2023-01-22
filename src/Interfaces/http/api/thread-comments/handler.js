const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.deleteThreadCommentHandler =
      this.deleteThreadCommentHandler.bind(this);
  }

  async postThreadCommentHandler(request, h) {
    const { userId } = request.auth.credentials;
    const { threadId } = request.params;
    const addThreadCommentUseCase = this._container.getInstance(
      AddThreadCommentUseCase.name,
    );
    const addedComment = await addThreadCommentUseCase.execute({
      ...request.payload,
      owner: userId,
      threadId,
    });
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentHandler(request) {
    const { userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const deleteThreadCommentUseCase = this._container.getInstance(
      DeleteThreadCommentUseCase.name,
    );

    await deleteThreadCommentUseCase.execute({
      owner: userId,
      id: commentId,
      threadId,
    });

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadCommentsHandler;
