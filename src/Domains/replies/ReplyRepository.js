/* eslint-disable no-unused-vars */

class ReplyRepository {
  constructor() {
    this.errorMessage = 'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED';
  }

  async addReply(newReply) {
    throw new Error(this.errorMessage);
  }

  async deleteReplyById(id) {
    throw new Error(this.errorMessage);
  }

  async getRepliesByThreadId(threadId) {
    throw new Error(this.errorMessage);
  }

  async verifyReply(commentId, replyId) {
    throw new Error(this.errorMessage);
  }

  async verifyReplyOwner(replyId, owner) {
    throw new Error(this.errorMessage);
  }
}

module.exports = ReplyRepository;
