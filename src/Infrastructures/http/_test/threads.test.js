const createServer = require('../createServer');
const { pool, container } = require('../..');
const {
  UsersTableTestHelper,
  AuthenticationsTableTestHelper,
  ThreadsTableTestHelper,
  CommentsTableTestHelper,
} = require('../../../../tests');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      const requestPayload = {
        title: 'A Thread',
        body: 'A Thread Body',
      };
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should response 401 when no access token is provided', async () => {
      const requestPayload = {
        title: 'A Thread',
        body: 'A Thread Body',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when payload did not contain needed property', async () => {
      const requestPayload = {
        title: 'A Thread',
      };
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when payload did not meet data type specification', async () => {
      const requestPayload = {
        title: 'A Thread',
        body: {},
      };
      const server = await createServer(container);

      const { accessToken } = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai',
      );
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should respond with 200 and return thread detail', async () => {
      const threadId = 'thread-123';

      const server = await createServer(container);

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'nicolauzp',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'pittersn',
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId,
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        threadId,
        owner: 'user-123',
      });

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
    });

    it('should respond with 200 and return thread detail with empty comments', async () => {
      const threadId = 'thread-123';

      const server = await createServer(container);

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'nicolauzp',
      });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: 'user-123',
      });

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(0);
    });

    it('should respond with 404 if thread does not exist', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/xyz',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
