/* eslint-disable no-unused-vars */

class CommentRepository {
  constructor() {
    this.errorMessage = 'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED';
  }

  async addComment(threadComment) {
    throw new Error(this.errorMessage);
  }

  async deleteCommentById(commentId) {
    throw new Error(this.errorMessage);
  }

  async getCommentsByThreadId(threadId) {
    throw new Error(this.errorMessage);
  }

  async verifyCommentOwner(commentId, owner) {
    throw new Error(this.errorMessage);
  }
}

module.exports = CommentRepository;
