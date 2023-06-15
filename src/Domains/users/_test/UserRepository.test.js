const UserRepository = require('../UserRepository');

describe('UserRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const userRepository = new UserRepository();
    const errorMessage = 'USER_REPOSITORY.METHOD_NOT_IMPLEMENTED';

    await expect(userRepository.addUser({})).rejects.toThrowError(errorMessage);
    await expect(
      userRepository.verifyAvailableUsername(''),
    ).rejects.toThrowError(errorMessage);
    await expect(userRepository.getPasswordByUsername('')).rejects.toThrowError(
      errorMessage,
    );
    await expect(userRepository.getIdByUsername('')).rejects.toThrowError(
      errorMessage,
    );
  });
});
