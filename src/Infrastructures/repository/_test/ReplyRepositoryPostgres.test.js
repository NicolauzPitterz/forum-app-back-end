const { pool, ReplyRepositoryPostgres } = require('../..');
const { NotFoundError } = require('../../../Commons');
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

        const reply = await RepliesTableTestHelper.findReplyById(addedReply.id);

        expect(reply).toBeDefined();
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
        ).resolves.not.toThrowError();
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
        ).rejects.toThrowError('reply yang Anda cari tidak ada');
      });

      it('should reject if comment is already deleted', async () => {
        const payload = {
          commentId: 'comment-123',
          replyId: 'reply-123',
        };

        await RepliesTableTestHelper.addReply({
          id: payload.replyId,
          isDelete: true,
        });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        await expect(
          replyRepositoryPostgres.verifyReply(
            payload.commentId,
            payload.replyId,
          ),
        ).rejects.toThrowError('reply sudah dihapus sebelumnya');
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
        ).rejects.toThrowError(
          'proses gagal karena Anda tidak mempunyai akses ke aksi ini',
        );
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
            username: 'pittersn',
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
            id: 'reply-123',
            commentId: 'comment-123',
            content: 'A Comment Reply A',
            date: repliesDetail[0].date,
            username: repliesDetail[0].username,
            isDelete: false,
          }),
          new ReplyDetail({
            id: 'reply-456',
            commentId: 'comment-123',
            content: 'A Comment Reply B',
            date: repliesDetail[1].date,
            username: repliesDetail[1].username,
            isDelete: false,
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
