/* istanbul ignore file */

const ServerTestHelper = {
  async getAccessToken({ server, username = 'nicolauzp' }) {
    const payload = {
      username,
      password: 'secret',
    };

    const { payload: responseUserPayload } = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...payload,
        fullname: 'Nicolauz Pitters',
      },
    });

    const { payload: responseAuthPayload } = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload,
    });

    const { id: userId } = JSON.parse(responseUserPayload).data.addedUser;
    const { accessToken } = JSON.parse(responseAuthPayload).data;

    return { accessToken, userId };
  },
};

module.exports = ServerTestHelper;
