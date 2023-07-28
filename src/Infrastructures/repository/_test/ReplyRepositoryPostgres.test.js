const { pool, ReplyRepositoryPostgres } = require('../..');
const { NotFoundError, AuthorizationError } = require('../../../Commons');
const {
  AddReply,
  AddedReply,
  ReplyDetail,
  ReplyRepository,
} = require('../../../Domains');
const {
  UsersTableTestHelper,
  CommentsTableTestHelper,
  ThreadsTableTestHelper,
  RepliesTableTestHelper,
} = require('../../../../tests');

describe('ReplyRepositoryPostgres', () => {
  it('should be instance of ReplyRepository domain', () => {
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {});

    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepository);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      const payload = {
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      };

      await UsersTableTestHelper.addUser({
        id: payload.userId,
        username: 'nicolauzp',
      });
      await ThreadsTableTestHelper.addThread({
        id: payload.threadId,
        owner: payload.userId,
      });
      await CommentsTableTestHelper.addComment({
        id: payload.commentId,
        threadId: payload.threadId,
        owner: payload.userId,
      });
    });

    afterEach(async () => {
      await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await RepliesTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('addReply function', () => {
      it('should persist add reply and return addedReply correctly', async () => {
        const newReply = new AddReply({
          commentId: 'comment-123',
          content: 'A Comment Reply',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '123';
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        const addedReply = await replyRepositoryPostgres.addReply(newReply);

        const { id, commentId, content, owner, date, isDelete } =
          await RepliesTableTestHelper.findReplyById(addedReply.id);

        const expectedReply = {
          id: 'reply-123',
          commentId: 'comment-123',
          content: 'A Comment Reply',
          owner: 'user-123',
          date,
          isDelete: false,
        };

        expect(id).toEqual(expectedReply.id);
        expect(commentId).toEqual(expectedReply.commentId);
        expect(content).toEqual(expectedReply.content);
        expect(owner).toEqual(expectedReply.owner);
        expect(date).toEqual(expectedReply.date);
        expect(isDelete).toEqual(expectedReply.isDelete);
        expect(addedReply).toStrictEqual(
          new AddedReply({
            id: 'reply-123',
            content: 'A Comment Reply',
            owner: 'user-123',
          }),
        );
      });
    });

    describe('deleteReplyById function', () => {
      it('should throw NotFoundError when reply does not exist', async () => {
        const replyId = 'reply-123';

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        await expect(
          replyRepositoryPostgres.deleteReplyById(replyId),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should delete added reply by id', async () => {
        const replyId = 'reply-123';

        await RepliesTableTestHelper.addReply({
          id: replyId,
          commentId: 'comment-123',
        });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        await replyRepositoryPostgres.deleteReplyById(replyId);

        const reply = await RepliesTableTestHelper.findReplyById(replyId);
        expect(reply.isDelete).toEqual(true);
      });
    });

    describe('verifyReply function', () => {
      it('should resolve if reply exists', async () => {
        const payload = {
          commentId: 'comment-123',
          replyId: 'reply-123',
        };

        await RepliesTableTestHelper.addReply({
          id: payload.replyId,
        });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        await expect(
          replyRepositoryPostgres.verifyReply(
            payload.commentId,
            payload.replyId,
          ),
        ).resolves.not.toThrow(NotFoundError);
      });

      it('should reject if reply does not exist', async () => {
        const payload = {
          commentId: 'comment-123',
          replyId: 'reply-123',
        };

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        await expect(
          replyRepositoryPostgres.verifyReply(
            payload.commentId,
            payload.replyId,
          ),
        ).rejects.toThrowError(NotFoundError);
      });
    });

    describe('verifyReplyOwner function', () => {
      it('should resolve if user has authorization', async () => {
        await RepliesTableTestHelper.addReply({
          id: 'reply-123',
          commentId: 'comment-123',
          owner: 'user-123',
        });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        await expect(
          replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'),
        ).resolves.toBeUndefined();
      });

      it('should throw error if user has no authorization', async () => {
        await RepliesTableTestHelper.addReply({
          id: 'reply-123',
          commentId: 'comment-123',
          owner: 'user-123',
        });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        await expect(
          replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-321'),
        ).rejects.toThrowError(AuthorizationError);
      });
    });

    describe('getRepliesByThreadId', () => {
      it('should return all replies from a thread', async () => {
        const replies = [
          {
            id: 'reply-123',
            commentId: 'comment-123',
            content: 'A Comment Reply A',
            date: '2023',
            username: 'nicolauzp',
            isDelete: false,
          },
          {
            id: 'reply-456',
            commentId: 'comment-123',
            content: 'A Comment Reply B',
            date: '2023',
            username: 'nicolauzp',
            isDelete: false,
          },
        ];

        await RepliesTableTestHelper.addReply(replies[0]);
        await RepliesTableTestHelper.addReply(replies[1]);

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        const repliesDetail =
          await replyRepositoryPostgres.getRepliesByThreadId('thread-123');
        expect(repliesDetail).toEqual([
          new ReplyDetail({
            ...replies[0],
            date: repliesDetail[0].date,
          }),
          new ReplyDetail({
            ...replies[1],
            date: repliesDetail[1].date,
          }),
        ]);
      });

      it('should return an empty array when no comments exist on a thread', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        const repliesDetail =
          await replyRepositoryPostgres.getRepliesByThreadId('thread-123');
        expect(repliesDetail).toStrictEqual([]);
      });
    });
  });
});
