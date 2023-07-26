const UserLogin = require('../UserLogin');

describe('UserLogin entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = {
      username: 'nicolauzp',
    };

    expect(() => new UserLogin(payload)).toThrowError(
      'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      username: 'nicolauzp',
      password: 12345,
    };

    expect(() => new UserLogin(payload)).toThrowError(
      'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create UserLogin entities correctly', () => {
    const payload = {
      username: 'nicolauzp',
      password: 'secret',
    };

    const userLogin = new UserLogin(payload);

    expect(userLogin).toBeInstanceOf(UserLogin);
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
  });
});
