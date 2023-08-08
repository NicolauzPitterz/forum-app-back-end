const autoBind = require('auto-bind');
const { LikeCommentUseCase } = require('../../../../Applications');

class LikesHandler {
  constructor(container) {
    this.container = container;

    autoBind(this);
  }

  async putLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;

    const likeCommentUseCase = await this.container.getInstance(
      LikeCommentUseCase.name,
    );

    await likeCommentUseCase.execute(request.params, userId);

    return h.response({
      status: 'success',
    });
  }
}

module.exports = LikesHandler;
