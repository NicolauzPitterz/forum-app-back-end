const { PasswordHash, AddUserUseCase } = require('../../..');
const {
  RegisterUser,
  RegisteredUser,
  UserRepository,
} = require('../../../../Domains');

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const useCasePayload = {
      username: 'nicolauzp',
      password: 'secret',
      fullname: 'Nicolauz Pitters',
    };

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.verifyAvailableUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest
      .fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new RegisteredUser({
          id: 'user-123',
          username: 'nicolauzp',
          fullname: 'Nicolauz Pitters',
        }),
      ),
    );

    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    const registeredUser = await getUserUseCase.execute(useCasePayload);

    expect(registeredUser).toStrictEqual(mockRegisteredUser);
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(
      useCasePayload.username,
    );
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(
      new RegisterUser({
        username: useCasePayload.username,
        password: 'encrypted_password',
        fullname: useCasePayload.fullname,
      }),
    );
  });
});
