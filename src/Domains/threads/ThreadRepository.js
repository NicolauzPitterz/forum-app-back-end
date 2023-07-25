/* eslint-disable no-unused-vars */

class ThreadRepository {
  constructor() {
    this.errorMessage = 'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED';
  }

  async addThread(thread) {
    throw new Error(this.errorMessage);
  }

  async getThreadDetailById(threadId) {
    throw new Error(this.errorMessage);
  }

  async verifyThread(threadId) {
    throw new Error(this.errorMessage);
  }
}

module.exports = ThreadRepository;
