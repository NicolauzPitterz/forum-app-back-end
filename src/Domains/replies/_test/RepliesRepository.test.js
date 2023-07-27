const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
  it('should throw an error when invoke abstract behaviour', async () => {
    const replyRepository = new ReplyRepository();
    const errorMessage = 'REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED';

    await expect(replyRepository.addReply({})).rejects.toThrowError(
      errorMessage,
    );
    await expect(replyRepository.deleteReplyById('')).rejects.toThrowError(
      errorMessage,
    );
    await expect(replyRepository.getRepliesByThreadId('')).rejects.toThrowError(
      errorMessage,
    );
    await expect(replyRepository.verifyReply('', '')).rejects.toThrowError(
      errorMessage,
    );
    await expect(replyRepository.verifyReplyOwner('', '')).rejects.toThrowError(
      errorMessage,
    );
  });
});
