const autoBind = require('auto-bind');
const {
  LoginUserUseCase,
  RefreshAuthenticationUseCase,
  LogoutUserUseCase,
} = require('../../../../Applications');

class AuthenticationsHandler {
  constructor(container) {
    this.container = container;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    const loginUserUseCase = this.container.getInstance(LoginUserUseCase.name);

    const { accessToken, refreshToken } = await loginUserUseCase.execute(
      request.payload,
    );

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request) {
    const refreshAuthenticationUseCase = this.container.getInstance(
      RefreshAuthenticationUseCase.name,
    );

    const accessToken = await refreshAuthenticationUseCase.execute(
      request.payload,
    );

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    const logoutUserUseCase = this.container.getInstance(
      LogoutUserUseCase.name,
    );

    await logoutUserUseCase.execute(request.payload);

    return {
      status: 'success',
    };
  }
}

module.exports = AuthenticationsHandler;
