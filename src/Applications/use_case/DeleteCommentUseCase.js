class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute(useCaseParam) {
    const { threadId, commentId, owner } = useCaseParam;
    await this.threadRepository.getThreadDetailById(threadId);
    await this.commentRepository.verifyComment(threadId, commentId);
    await this.commentRepository.verifyCommentOwner(commentId, owner);
    await this.commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
