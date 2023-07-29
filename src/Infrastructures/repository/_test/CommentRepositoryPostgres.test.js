const { pool, CommentRepositoryPostgres } = require('../..');
const { NotFoundError, AuthorizationError } = require('../../../Commons');
const {
  AddComment,
  AddedComment,
  CommentRepository,
} = require('../../../Domains');
const {
  UsersTableTestHelper,
  CommentsTableTestHelper,
  ThreadsTableTestHelper,
} = require('../../../../tests');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
  });

  describe('behavior test', () => {
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

        const { id, threadId, content, owner, date, isDelete } =
          await CommentsTableTestHelper.findCommentById(addedComment.id);

        const expectedComment = {
          id: 'comment-123',
          threadId: 'thread-123',
          content: 'A Thread Comment',
          owner: 'user-123',
          date,
          isDelete: false,
        };

        expect(id).toEqual(expectedComment.id);
        expect(threadId).toEqual(expectedComment.threadId);
        expect(content).toEqual(expectedComment.content);
        expect(owner).toEqual(expectedComment.owner);
        expect(date).toEqual(expectedComment.date);
        expect(isDelete).toEqual(expectedComment.isDelete);
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

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );

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

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );

        await commentRepositoryPostgres.deleteCommentById(commentId);
        const comment = await CommentsTableTestHelper.findCommentById(
          commentId,
        );

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

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );

        await expect(
          commentRepositoryPostgres.verifyComment(
            payload.threadId,
            payload.commentId,
          ),
        ).resolves.not.toThrow(NotFoundError);
      });

      it('should reject if comment does not exist', async () => {
        const payload = {
          threadId: 'thread-123',
          commentId: 'comment-123',
        };

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );

        await expect(
          commentRepositoryPostgres.verifyComment(
            payload.threadId,
            payload.commentId,
          ),
        ).rejects.toThrowError(NotFoundError);
      });
    });

    describe('verifyCommentOwner function', () => {
      it('should resolve if user has authorization', async () => {
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123',
        });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );

        await expect(
          commentRepositoryPostgres.verifyCommentOwner(
            'comment-123',
            'user-123',
          ),
        ).resolves.toBeUndefined();
      });

      it('should throw error if user has no authorization', async () => {
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123',
        });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );

        await expect(
          commentRepositoryPostgres.verifyCommentOwner(
            'comment-123',
            'user-321',
          ),
        ).rejects.toThrowError(AuthorizationError);
      });
    });

    describe('getCommentsByThreadId', () => {
      it('should return all comments from a thread', async () => {
        const comments = [
          {
            id: 'comment-123',
            username: 'nicolauzp',
            date: '2023',
            content: 'A Thread Comment A',
            isDelete: false,
          },
          {
            id: 'comment-456',
            username: 'nicolauzp',
            date: '2023',
            content: 'A Thread Comment B',
            isDelete: false,
          },
        ];

        await CommentsTableTestHelper.addComment(comments[0]);
        await CommentsTableTestHelper.addComment(comments[1]);

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );

        const commentsDetail =
          await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
        expect(commentsDetail).toEqual([
          {
            ...comments[0],
            date: commentsDetail[0].date,
          },
          {
            ...comments[1],
            date: commentsDetail[1].date,
          },
        ]);
      });

      it('should return an empty array when no comments exist on a thread', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {},
        );

        const commentsDetail =
          await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
        expect(commentsDetail).toStrictEqual([]);
      });
    });
  });
});
