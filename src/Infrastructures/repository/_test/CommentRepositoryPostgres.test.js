const { pool, CommentRepositoryPostgres } = require('../..');
const { NotFoundError } = require('../../../Commons');
const { AddComment, AddedComment, CommentDetail } = require('../../../Domains');
const {
  UsersTableTestHelper,
  CommentsTableTestHelper,
  ThreadsTableTestHelper,
} = require('../../../../tests');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
    };
    await UsersTableTestHelper.addUser({
      id: payload.userId,
      username: 'nicolauzp',
    });
    await ThreadsTableTestHelper.addThread({
      id: payload.threadId,
      owner: payload.userId,
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
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

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment does not exist', async () => {
      const commentId = 'comment-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.deleteCommentById(commentId),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should delete added comment by id', async () => {
      const commentId = 'comment-123';

      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteCommentById(commentId);
      const comment = await CommentsTableTestHelper.findCommentById(commentId);

      expect(comment.isDelete).toEqual(true);
    });
  });

  describe('verifyComment function', () => {
    it('should resolve if comment exists', async () => {
      const payload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
      };

      await CommentsTableTestHelper.addComment({
        id: payload.commentId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyComment(
          payload.threadId,
          payload.commentId,
        ),
      ).resolves.not.toThrowError();
    });

    it('should reject if comment does not exist', async () => {
      const payload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
      };

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyComment(
          payload.threadId,
          payload.commentId,
        ),
      ).rejects.toThrowError('comment yang Anda cari tidak ada');
    });

    it('should reject if comment is already deleted', async () => {
      const payload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
      };

      await CommentsTableTestHelper.addComment({
        id: payload.commentId,
        isDelete: true,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyComment(
          payload.threadId,
          payload.commentId,
        ),
      ).rejects.toThrowError('comment sudah dihapus sebelumnya');
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should resolve if user has authorization', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'),
      ).resolves.toBeUndefined();
    });

    it('should throw error if user has no authorization', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-321'),
      ).rejects.toThrowError(
        'proses gagal karena Anda tidak mempunyai akses ke aksi ini',
      );
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return all comments from a thread', async () => {
      const comments = [
        {
          id: 'comment-123',
          username: 'nicolauzp',
          date: '2023',
          content: 'A Thread A',
          isDelete: false,
        },
        {
          id: 'comment-456',
          username: 'pittersn',
          date: '2023',
          content: 'A Thread B',
          isDelete: false,
        },
      ];

      await CommentsTableTestHelper.addComment(comments[0]);
      await CommentsTableTestHelper.addComment(comments[1]);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const commentsDetail =
        await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      expect(commentsDetail).toEqual([
        new CommentDetail({
          id: 'comment-123',
          username: commentsDetail[0].username,
          date: commentsDetail[0].date,
          content: 'A Thread A',
          isDelete: false,
        }),
        new CommentDetail({
          id: 'comment-456',
          username: commentsDetail[1].username,
          date: commentsDetail[1].date,
          content: 'A Thread B',
          isDelete: false,
        }),
      ]);
    });

    it('should return an empty array when no comments exist on a thread', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const commentsDetail =
        await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
      expect(commentsDetail).toStrictEqual([]);
    });
  });
});
