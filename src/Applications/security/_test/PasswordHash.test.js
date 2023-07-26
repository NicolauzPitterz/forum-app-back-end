const EncryptionHelper = require('../PasswordHash');

describe('EncryptionHelper interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const encryptionHelper = new EncryptionHelper();
    const errorMessage = 'PASSWORD_HASH.METHOD_NOT_IMPLEMENTED';

    await expect(encryptionHelper.hash('dummy_password')).rejects.toThrowError(
      errorMessage,
    );
    await expect(
      encryptionHelper.comparePassword('plain', 'encrypted'),
    ).rejects.toThrowError(errorMessage);
  });
});
