/* eslint-disable no-unused-vars */

class CommentRepository {
  constructor() {
    this.errorMessage = 'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED';
  }

  async addComment(newComment) {
    throw new Error(this.errorMessage);
  }

  async deleteCommentById(id) {
    throw new Error(this.errorMessage);
  }

  async getCommentsByThreadId(threadId) {
    throw new Error(this.errorMessage);
  }

  async verifyComment(id) {
    throw new Error(this.errorMessage);
  }

  async verifyCommentOwner(commentId, owner) {
    throw new Error(this.errorMessage);
  }
}

module.exports = CommentRepository;
