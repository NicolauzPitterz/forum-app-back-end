/* eslint-disable no-unused-vars */

class AuthenticationTokenManager {
  constructor() {
    this.errorMessage = 'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED';
  }

  async createRefreshToken(payload) {
    throw new Error(this.errorMessage);
  }

  async createAccessToken(payload) {
    throw new Error(this.errorMessage);
  }

  async verifyRefreshToken(token) {
    throw new Error(this.errorMessage);
  }

  async decodePayload() {
    throw new Error(this.errorMessage);
  }
}

module.exports = AuthenticationTokenManager;
