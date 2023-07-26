const {
  pool,
  CommentRepositoryPostgres,
  ThreadRepositoryPostgres,
} = require('../..');
const { AddComment, AddedComment } = require('../../../Domains');
const {
  UsersTableTestHelper,
  CommentsTableTestHelper,
  ThreadsTableTestHelper,
} = require('../../../../tests');
const { NotFoundError } = require('../../../Commons');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      await expect(
        threadRepositoryPostgres.getThreadDetailById('thread-321'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should persist add comment and return added comment correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'nicolauzp',
        password: 'secret',
        fullname: 'Nicolauz Pitters',
      });

      const newComment = new AddComment({
        threadId: 'thread-123',
        content: 'A Thread Comment',
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
          content: 'A Thread Comment',
          owner: 'user-123',
        }),
      );
    });
  });
});
