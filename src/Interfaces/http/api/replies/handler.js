const autoBind = require('auto-bind');
const {
  DeleteCommentUseCase,
  AddReplyUseCase,
} = require('../../../../Applications');

class RepliesHandler {
  constructor(container) {
    this.container = container;

    autoBind(this);
  }

  async postReplyHandler(request, h) {
    const { id: userId } = request.auth.credentials;

    const addReplyUseCase = await this.container.getInstance(
      AddReplyUseCase.name,
    );

    const addedReply = await addReplyUseCase.execute(
      request.params,
      request.payload,
      userId,
    );

    const res = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    res.code(201);
    return res;
  }

  async deleteReplyByIdHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: userId } = request.auth.credentials;

    const deleteCommentUseCase = await this.container.getInstance(
      DeleteCommentUseCase.name,
    );

    await deleteCommentUseCase.execute({
      threadId,
      commentId,
      replyId,
      owner: userId,
    });

    return h.response({
      status: 'success',
    });
  }
}

module.exports = RepliesHandler;
