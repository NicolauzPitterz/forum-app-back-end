class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.replyRepository = replyRepository;
  }

  async execute(useCaseParam) {
    const { threadId, commentId, replyId, owner } = useCaseParam;
    await this.threadRepository.getThreadDetailById(threadId);
    await this.commentRepository.verifyComment(threadId, commentId);
    await this.replyRepository.verifyReply(commentId, replyId);
    await this.replyRepository.verifyReplyOwner(replyId, owner);
    await this.replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
