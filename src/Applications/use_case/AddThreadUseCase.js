const { AddThread } = require('../../Domains');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    const newThread = new AddThread({ ...useCasePayload, owner });
    return this.threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
