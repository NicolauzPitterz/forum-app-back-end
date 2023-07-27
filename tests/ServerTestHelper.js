/* istanbul ignore file */

const { createServer, container } = require('../src/Infrastructures');

const ServerTestHelper = {
  async getAccessToken(username = 'nicolauzp') {
    const payload = {
      username,
      password: 'secret',
    };

    const server = await createServer(container);

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...payload,
        fullname: 'Nicolauz Pitters',
      },
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload,
    });

    const { id: userId } = JSON.parse(responseUser.payload).data.addedUser;
    const { accessToken } = JSON.parse(responseAuth.payload).data;

    return { accessToken, userId };
  },
};

module.exports = ServerTestHelper;
