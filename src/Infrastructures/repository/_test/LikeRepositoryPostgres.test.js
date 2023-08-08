const { LikeRepositoryPostgres, pool } = require('../..');
const {
  UsersTableTestHelper,
  ThreadsTableTestHelper,
  CommentsTableTestHelper,
  LikesTableTestHelper,
} = require('../../../../tests');
const { NotFoundError } = require('../../../Commons');
const { AddLike, LikeRepository } = require('../../../Domains');

describe('LikeRepositoryPostgres', () => {
  it('should be instance of LikeRepository domain', () => {
    const likeRepository = new LikeRepositoryPostgres();

    expect(likeRepository).toBeInstanceOf(LikeRepository);
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
      await LikesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await LikesTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('addLike function', () => {
      it('should persist add reply and return addedReply correctly', async () => {
        const newLike = new AddLike({
          commentId: 'comment-123',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '123';
        const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        const addedLike = await likeRepositoryPostgres.addLike(newLike);

        const like = await LikesTableTestHelper.findLikeByCommentIdAndOwner(
          newLike.commentId,
          newLike.owner,
        );

        expect(like).toStrictEqual({
          id: 'like-123',
          commentId: 'comment-123',
          owner: 'user-123',
        });
        expect(addedLike).toStrictEqual({
          id: 'like-123',
        });
      });
    });

    describe('deleteLikeById function', () => {
      it('should throw error when like does not exist', async () => {
        const likeId = 'like-123';

        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        await expect(
          likeRepositoryPostgres.deleteLikeById(likeId),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should not throw error when deleting likes', async () => {
        const likeId = 'like-123';
        const commentId = 'comment-123';
        const owner = 'user-123';

        await LikesTableTestHelper.addLike({
          id: likeId,
          commentId,
          owner,
        });

        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        await expect(
          likeRepositoryPostgres.deleteLikeById(likeId),
        ).resolves.not.toThrowError();
      });
    });

    describe('verifyLike function', () => {
      it('should resolve likeId if like exists', async () => {
        const payload = {
          likeId: 'like-123',
          commentId: 'comment-123',
          owner: 'user-123',
        };

        await LikesTableTestHelper.addLike({
          id: payload.likeId,
          commentId: payload.commentId,
          owner: payload.owner,
        });

        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        const likeId = await likeRepositoryPostgres.verifyLike(
          payload.commentId,
          payload.owner,
        );

        expect(likeId.id).toEqual('like-123');
      });

      it('should resolve undefined likeId if like does not exist', async () => {
        const payload = {
          likeId: 'like-123',
          commentId: 'comment-123',
          owner: 'user-123',
        };

        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        const likeId = await likeRepositoryPostgres.verifyLike(
          payload.commentId,
          payload.likeId,
        );

        expect(likeId).toBeUndefined();
      });
    });

    describe('getLikesByCommentId function', () => {
      it('should return likeCount=1 from a comment', async () => {
        const commentId = 'comment-123';
        const owner = 'user-123';

        await LikesTableTestHelper.addLike({
          commentId,
          owner,
        });

        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        const likeCount = await likeRepositoryPostgres.getLikesByCommentId(
          commentId,
        );

        expect(likeCount).toEqual(1);
      });

      it('should return likeCount=0 from a comment', async () => {
        const commentId = 'comment-123';

        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

        const likeCount = await likeRepositoryPostgres.getLikesByCommentId(
          commentId,
        );

        expect(likeCount).toEqual(0);
      });
    });
  });
});
