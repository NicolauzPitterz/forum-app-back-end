const { pool, createServer, container } = require('../..');
const {
  UsersTableTestHelper,
  AuthenticationsTableTestHelper,
  ThreadsTableTestHelper,
  CommentsTableTestHelper,
  ServerTestHelper,
} = require('../../../../tests');

describe('/comments endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      const requestPayload = {
        content: 'A Thread Comment',
      };
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      const threadId = 'thread-123';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should response 400 when payload did not contain needed property', async () => {
      const requestPayload = {};
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      const threadId = 'thread-123';

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userId,
      });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when payload did not meet data type specification', async () => {
      const requestPayload = {
        content: 123,
      };
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      const threadId = 'thread-123';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai',
      );
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should respond with 200 and return success status', async () => {
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper.getAccessToken({
        server,
      });
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userId,
      });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should respond with 403 when someone does not have access to delete the comment', async () => {
      const server = await createServer(container);

      const { userId: firstUserId } = await ServerTestHelper.getAccessToken({
        server,
      });
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: firstUserId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: firstUserId,
      });

      const { accessToken: secondUserAccessToken } =
        await ServerTestHelper.getAccessToken({ server, username: 'pittersn' });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${secondUserAccessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'proses gagal karena Anda tidak mempunyai akses ke aksi ini',
      );
    });
  });
});
