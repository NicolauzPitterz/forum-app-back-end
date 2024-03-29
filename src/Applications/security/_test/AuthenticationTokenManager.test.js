const AuthenticationTokenManager = require('../AuthenticationTokenManager');

describe('AuthenticationTokenManager interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const tokenManager = new AuthenticationTokenManager();
    const errorMessage = 'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED';

    await expect(tokenManager.createAccessToken('')).rejects.toThrowError(
      errorMessage,
    );
    await expect(tokenManager.createRefreshToken('')).rejects.toThrowError(
      errorMessage,
    );
    await expect(tokenManager.verifyRefreshToken('')).rejects.toThrowError(
      errorMessage,
    );
    await expect(tokenManager.decodePayload('')).rejects.toThrowError(
      errorMessage,
    );
  });
});
