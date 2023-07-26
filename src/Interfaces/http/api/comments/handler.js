const { AddCommentUseCase } = require('../../../../Applications');

class CommentsHandler {
  constructor(container) {
    this.container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const { id: userId } = request.auth.credentials;

    const addCommentUseCase = await this.container.getInstance(
      AddCommentUseCase.name,
    );

    const addedComment = await addCommentUseCase.execute(
      threadId,
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
}

module.exports = CommentsHandler;
