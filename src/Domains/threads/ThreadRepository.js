/* eslint-disable no-unused-vars */

class ThreadRepository {
  constructor() {
    this.errorMessage = 'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED';
  }

  async addThread(newThread) {
    throw new Error(this.errorMessage);
  }

  async getThreadDetailById(id) {
    throw new Error(this.errorMessage);
  }

  async verifyThread(id) {
    throw new Error(this.errorMessage);
  }
}

module.exports = ThreadRepository;
