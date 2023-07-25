/* eslint-disable no-unused-vars */

class PasswordHash {
  constructor() {
    this.errorMessage = 'PASSWORD_HASH.METHOD_NOT_IMPLEMENTED';
  }

  async hash(password) {
    throw new Error(this.errorMessage);
  }

  async comparePassword(plain, encrypted) {
    throw new Error(this.errorMessage);
  }
}

module.exports = PasswordHash;
