const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw an error when invoke abstract behaviour', async () => {
    const commentRepository = new CommentRepository();
    const errorMessage = 'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED';

    await expect(commentRepository.addComment({})).rejects.toThrowError(
      errorMessage,
    );
    await expect(commentRepository.deleteCommentById('')).rejects.toThrowError(
      errorMessage,
    );
    await expect(
      commentRepository.getCommentsByThreadId(''),
    ).rejects.toThrowError(errorMessage);
    await expect(commentRepository.verifyComment('')).rejects.toThrowError(
      errorMessage,
    );
    await expect(
      commentRepository.verifyCommentOwner('', ''),
    ).rejects.toThrowError(errorMessage);
  });
});
