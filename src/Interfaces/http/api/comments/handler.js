const {
  AddCommentUseCase,
  DeleteCommentUseCase,
} = require('../../../../Applications');

class CommentsHandler {
  constructor(container) {
    this.container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;

    const addCommentUseCase = await this.container.getInstance(
      AddCommentUseCase.name,
    );

    const addedComment = await addCommentUseCase.execute(
      request.params,
      request.payload,
      userId,
    );

    const res = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    res.code(201);
    return res;
  }

  async deleteCommentByIdHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;

    const deleteCommentUseCase = await this.container.getInstance(
      DeleteCommentUseCase.name,
    );

    await deleteCommentUseCase.execute({ threadId, commentId, owner: userId });

    return h.response({
      status: 'success',
    });
  }
}

module.exports = CommentsHandler;
