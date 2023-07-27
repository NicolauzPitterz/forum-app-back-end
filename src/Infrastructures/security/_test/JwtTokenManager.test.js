const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../JwtTokenManager');
const { InvariantError } = require('../../../Commons');

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      const payload = {
        username: 'nicolauzp',
      };
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      const accessToken = await jwtTokenManager.createAccessToken(payload);

      expect(mockJwtToken.generate).toBeCalledWith(
        payload,
        process.env.ACCESS_TOKEN_KEY,
      );
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      const payload = {
        username: 'nicolauzp',
      };
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      expect(mockJwtToken.generate).toBeCalledWith(
        payload,
        process.env.REFRESH_TOKEN_KEY,
      );
      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({
        username: 'nicolauzp',
      });

      await expect(
        jwtTokenManager.verifyRefreshToken(accessToken),
      ).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createRefreshToken({
        username: 'nicolauzp',
      });

      await expect(
        jwtTokenManager.verifyRefreshToken(refreshToken),
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({
        username: 'nicolauzp',
      });

      const { username: expectedUsername } =
        await jwtTokenManager.decodePayload(accessToken);

      expect(expectedUsername).toEqual('nicolauzp');
    });
  });
});
