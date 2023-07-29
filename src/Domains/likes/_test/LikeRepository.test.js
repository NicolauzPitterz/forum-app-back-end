const LikeRepository = require('../LikeRepository');

describe('LikeRepository interface', () => {
  it('should throw an error when invoke abstract behaviour', async () => {
    const likeRepository = new LikeRepository();
    const errorMessage = 'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED';

    await expect(likeRepository.addLike({})).rejects.toThrowError(errorMessage);
    await expect(likeRepository.deleteLikeById('')).rejects.toThrowError(
      errorMessage,
    );
    await expect(likeRepository.getLikesByCommentId('')).rejects.toThrowError(
      errorMessage,
    );
    await expect(likeRepository.verifyLike('', '')).rejects.toThrowError(
      errorMessage,
    );
  });
});
