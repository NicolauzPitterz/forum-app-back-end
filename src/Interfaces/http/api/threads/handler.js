const {
  AddThreadUseCase,
  GetThreadDetailUseCase,
} = require('../../../../Applications');

class ThreadsHandler {
  constructor(container) {
    this.container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
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

  async getThreadDetailHandler(request, h) {
    const { threadId } = request.params;

    const getThreadDetailUseCase = await this.container.getInstance(
      GetThreadDetailUseCase.name,
    );

    const threadDetail = await getThreadDetailUseCase.execute({ threadId });

    const response = h.response({
      status: 'success',
      data: {
        thread: threadDetail,
      },
    });

    return response;
  }
}

module.exports = ThreadsHandler;
