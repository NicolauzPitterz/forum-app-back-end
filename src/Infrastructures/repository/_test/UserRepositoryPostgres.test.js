const { pool, UserRepositoryPostgres } = require('../..');
const { InvariantError } = require('../../../Commons');
const {
  RegisterUser,
  RegisteredUser,
  UserRepository,
} = require('../../../Domains');
const { UsersTableTestHelper } = require('../../../../tests');

describe('UserRepositoryPostgres', () => {
  it('should be instance of UserRepository domain', () => {
    const userRepositoryPostgres = new UserRepositoryPostgres({}, {});

    expect(userRepositoryPostgres).toBeInstanceOf(UserRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('verifyAvailableUsername function', () => {
      it('should throw InvariantError when username not available', async () => {
        await UsersTableTestHelper.addUser({ username: 'nicolauzp' });
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

        await expect(
          userRepositoryPostgres.verifyAvailableUsername('nicolauzp'),
        ).rejects.toThrowError(InvariantError);
      });

      it('should not throw InvariantError when username available', async () => {
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

        await expect(
          userRepositoryPostgres.verifyAvailableUsername('nicolauzp'),
        ).resolves.not.toThrowError(InvariantError);
      });
    });

    describe('addUser function', () => {
      it('should persist register user and return registered user correctly', async () => {
        const registerUser = new RegisterUser({
          username: 'nicolauzp',
          password: 'secret',
          fullname: 'Nicolauz Pitters',
        });
        const fakeIdGenerator = () => '123';
        const userRepositoryPostgres = new UserRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        await userRepositoryPostgres.addUser(registerUser);

        const users = await UsersTableTestHelper.findUsersById('user-123');
        expect(users).toHaveLength(1);
      });

      it('should return registered user correctly', async () => {
        const registerUser = new RegisterUser({
          username: 'nicolauzp',
          password: 'secret',
          fullname: 'Nicolauz Pitters',
        });
        const fakeIdGenerator = () => '123';
        const userRepositoryPostgres = new UserRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        const registeredUser = await userRepositoryPostgres.addUser(
          registerUser,
        );

        expect(registeredUser).toStrictEqual(
          new RegisteredUser({
            id: 'user-123',
            username: 'nicolauzp',
            fullname: 'Nicolauz Pitters',
          }),
        );
      });
    });

    describe('getPasswordByUsername', () => {
      it('should throw InvariantError when user not found', () => {
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

        return expect(
          userRepositoryPostgres.getPasswordByUsername('dicoding'),
        ).rejects.toThrowError(InvariantError);
      });

      it('should return username password when user is found', async () => {
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({
          username: 'nicolauzp',
          password: 'secret',
        });

        const password = await userRepositoryPostgres.getPasswordByUsername(
          'nicolauzp',
        );
        expect(password).toBe('secret');
      });
    });

    describe('getIdByUsername', () => {
      it('should throw InvariantError when user not found', async () => {
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

        await expect(
          userRepositoryPostgres.getIdByUsername('nicolauzp'),
        ).rejects.toThrowError(InvariantError);
      });

      it('should return user id correctly', async () => {
        await UsersTableTestHelper.addUser({
          id: 'user-123',
          username: 'nicolauzp',
        });
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

        const userId = await userRepositoryPostgres.getIdByUsername(
          'nicolauzp',
        );

        expect(userId).toEqual('user-123');
      });
    });
  });
});
