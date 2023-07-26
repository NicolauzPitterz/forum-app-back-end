const { AddComment } = require('../../Domains');

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this.commentRepository = commentRepository;
  }

  async execute(useCasePayload, owner) {
    const newComment = new AddComment({ ...useCasePayload, owner });
    return this.commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
