const { AddComment } = require('../../Domains');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute(useCaseParam, useCasePayload, owner) {
    const { threadId } = useCaseParam;
    await this.threadRepository.getThreadDetailById(threadId);

    const newComment = new AddComment({ threadId, ...useCasePayload, owner });
    return this.commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
