const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw an error when invoke abstract behaviour', async () => {
    const threadRepository = new ThreadRepository();
    const errorMessage = 'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED';

    await expect(threadRepository.addThread({})).rejects.toThrowError(
      errorMessage,
    );
    await expect(threadRepository.getThreadDetailById('')).rejects.toThrowError(
      errorMessage,
    );
  });
});
