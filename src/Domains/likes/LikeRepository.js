/* eslint-disable no-unused-vars */

class LikeRepository {
  constructor() {
    this.errorMessage = 'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED';
  }

  async addLike(newLike) {
    throw new Error(this.errorMessage);
  }

  async deleteLikeById(id) {
    throw new Error(this.errorMessage);
  }

  async getLikesByCommentId(commentId) {
    throw new Error(this.errorMessage);
  }

  async verifyLike(commentId, owner) {
    throw new Error(this.errorMessage);
  }
}

module.exports = LikeRepository;
