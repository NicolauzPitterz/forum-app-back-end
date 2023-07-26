/* istanbul ignore file */

const { createServer, container } = require('../src/Infrastructures');

const ServerTestHelper = {
  async getAccessToken() {
    const payload = {
      username: 'nicolauzp',
      password: 'secret',
    };

    const server = await createServer(container);

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...payload,
        fullname: 'Nicolauz Pitters',
      },
    });

    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload,
    });

    const { accessToken } = JSON.parse(response.payload).data;

    return accessToken;
  },

  async getUserId() {
    const payload = {
      username: 'nicolauzp',
      password: 'secret',
      fullname: 'Nicolauz Pitters',
    };

    const server = await createServer(container);

    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload,
    });

    const { id: userId } = JSON.parse(response.payload).data.addedUser;

    return userId;
  },
};

module.exports = ServerTestHelper;
