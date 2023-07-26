const { pool, CommentRepositoryPostgres } = require('../..');
const { AddComment, AddedComment } = require('../../../Domains');
const {
  UsersTableTestHelper,
  CommentsTableTestHelper,
} = require('../../../../tests');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'nicolauzp',
        password: 'secret',
        fullname: 'Nicolauz Pitters',
      });

      const newComment = new AddComment({
        id: 'A Comment',
        content: 'Thread Comment',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const addedComment = await commentRepositoryPostgres.addComment(
        newComment,
      );

      const comments = await CommentsTableTestHelper.findCommentById(
        addedComment.id,
      );
      expect(comments).toBeDefined();
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'Thread Comment',
          owner: 'user-123',
        }),
      );
    });
  });

  // describe('getThreadDetailById function', () => {
  //   it('should throw NotFoundError when thread not found', async () => {
  //     const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
  //     await UsersTableTestHelper.addUser({ id: 'user-123' });
  //     await ThreadsTableTestHelper.addThread({
  //       id: 'thread-123',
  //       owner: 'user-123',
  //     });

  //     await expect(
  //       threadRepositoryPostgres.getThreadDetailById('thread-321'),
  //     ).rejects.toThrowError(NotFoundError);
  //   });

  //   it('should return thread if found', async () => {
  //     const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
  //     await UsersTableTestHelper.addUser({
  //       id: 'user-123',
  //       username: 'nicolauzp',
  //     });
  //     await ThreadsTableTestHelper.addThread({
  //       id: 'thread-123',
  //       title: 'A Thread',
  //       body: 'A Thread Body',
  //       owner: 'user-123',
  //     });

  //     const returnedThread = await threadRepositoryPostgres.getThreadDetailById(
  //       'thread-123',
  //     );

  //     expect(returnedThread).toStrictEqual({
  //       id: 'thread-123',
  //       title: 'A Thread',
  //       body: 'A Thread Body',
  //       owner: 'user-123',
  //       createdAt: returnedThread.createdAt,
  //     });
  //   });
  // });
});
