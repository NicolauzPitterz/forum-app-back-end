/* eslint-disable no-unused-vars */

class AuthenticationRepository {
  constructor() {
    this.errorMessage = 'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED';
  }

  async addToken(token) {
    throw new Error(this.errorMessage);
  }

  async checkAvailabilityToken(token) {
    throw new Error(this.errorMessage);
  }

  async deleteToken(token) {
    throw new Error(this.errorMessage);
  }
}

module.exports = AuthenticationRepository;
