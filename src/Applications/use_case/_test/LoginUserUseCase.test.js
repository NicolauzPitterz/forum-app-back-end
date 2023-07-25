const {
  AuthenticationTokenManager,
  PasswordHash,
  LoginUserUseCase,
} = require('../..');
const {
  UserRepository,
  AuthenticationRepository,
  NewAuth,
} = require('../../../Domains');

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    const useCasePayload = {
      username: 'nicolauzp',
      password: 'secret',
    };

    const mockedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.getPasswordByUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockPasswordHash.comparePassword = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.createAccessToken = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(mockedAuthentication.accessToken),
      );
    mockAuthenticationTokenManager.createRefreshToken = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(mockedAuthentication.refreshToken),
      );
    mockUserRepository.getIdByUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve('user-123'));
    mockAuthenticationRepository.addToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    expect(actualAuthentication).toEqual(
      new NewAuth({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      }),
    );
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith(
      'nicolauzp',
    );
    expect(mockPasswordHash.comparePassword).toBeCalledWith(
      'secret',
      'encrypted_password',
    );
    expect(mockUserRepository.getIdByUsername).toBeCalledWith('nicolauzp');
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      username: 'nicolauzp',
      id: 'user-123',
    });
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({
      username: 'nicolauzp',
      id: 'user-123',
    });
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(
      mockedAuthentication.refreshToken,
    );
  });
});
