const { AddLike } = require('../../../Domains');

class LikeCommentUseCase {
  constructor({ commentRepository, likeRepository }) {
    this.commentRepository = commentRepository;
    this.likeRepository = likeRepository;
  }

  async execute(useCaseParam, owner) {
    const { threadId, commentId } = useCaseParam;
    await this.commentRepository.verifyComment(threadId, commentId);
    const likeId = await this.likeRepository.verifyLike(commentId, owner);
    if (likeId) {
      await this.likeRepository.deleteLikeById(likeId);
    } else {
      const newLike = new AddLike({ commentId, owner });
      await this.likeRepository.addLike(newLike);
    }
  }
}

module.exports = LikeCommentUseCase;
