const { AddLike } = require('../../../Domains');

class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.likeRepository = likeRepository;
  }

  async execute(useCaseParam, owner) {
    const { threadId, commentId } = useCaseParam;
    await this.threadRepository.checkAvailabilityThread(threadId);
    await this.commentRepository.verifyComment(threadId, commentId);
    const likeId = await this.likeRepository.verifyLike(commentId, owner);
    if (likeId) {
      await this.likeRepository.deleteLikeById(likeId.id);
    } else {
      const newLike = new AddLike({ commentId, owner });
      await this.likeRepository.addLike(newLike);
    }
  }
}

module.exports = LikeCommentUseCase;
