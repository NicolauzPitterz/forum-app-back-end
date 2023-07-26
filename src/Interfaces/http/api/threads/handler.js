const { AddThreadUseCase } = require('../../../../Applications');

class ThreadsHandler {
  constructor(container) {
    this.container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: userId } = request.auth.credentials;

    const addThreadUseCase = await this.container.getInstance(
      AddThreadUseCase.name,
    );

    const addedThread = await addThreadUseCase.execute(request.payload, userId);

    const res = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    res.code(201);
    return res;
  }
}

module.exports = ThreadsHandler;