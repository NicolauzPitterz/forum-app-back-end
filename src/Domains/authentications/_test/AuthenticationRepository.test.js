const AuthenticationRepository = require('../AuthenticationRepository');

describe('AuthenticationRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const authenticationRepository = new AuthenticationRepository();
    const errorMessage = 'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED';

    await expect(authenticationRepository.addToken('')).rejects.toThrowError(
      errorMessage,
    );
    await expect(
      authenticationRepository.checkAvailabilityToken(''),
    ).rejects.toThrowError(errorMessage);
    await expect(authenticationRepository.deleteToken('')).rejects.toThrowError(
      errorMessage,
    );
  });
});
