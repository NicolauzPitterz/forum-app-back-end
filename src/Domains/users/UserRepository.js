/* eslint-disable no-unused-vars */

class UserRepository {
  constructor() {
    this.errorMessage = 'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED';
  }

  async addUser(registerUser) {
    throw new Error(this.errorMessage);
  }

  async verifyAvailableUsername(username) {
    throw new Error(this.errorMessage);
  }

  async getPasswordByUsername(username) {
    throw new Error(this.errorMessage);
  }

  async getIdByUsername(username) {
    throw new Error(this.errorMessage);
  }
}

module.exports = UserRepository;
