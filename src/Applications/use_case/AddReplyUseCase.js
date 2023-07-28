const { AddReply } = require('../../Domains');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(useCaseParam, useCasePayload, owner) {
    const { threadId, commentId } = useCaseParam;
    await this.threadRepository.checkAvailabilityThread(threadId);
    await this.commentRepository.verifyComment(threadId, commentId);
    const newReply = new AddReply({ commentId, ...useCasePayload, owner });
    return this.replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
