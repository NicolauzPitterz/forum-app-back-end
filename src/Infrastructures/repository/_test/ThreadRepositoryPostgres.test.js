const { pool, ThreadRepositoryPostgres } = require('../..');
const { NotFoundError } = require('../../../Commons');
const {
  AddThread,
  AddedThread,
  ThreadRepository,
} = require('../../../Domains');
const {
  ThreadsTableTestHelper,
  UsersTableTestHelper,
} = require('../../../../tests');

describe('ThreadRepositoryPostgres', () => {
  it('should be an instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should persist add thread and return added thread correctly', async () => {
        await UsersTableTestHelper.addUser({
          id: 'user-123',
          username: 'nicolauzp',
          password: 'secret',
          fullname: 'Nicolauz Pitters',
        });

        const newThread = new AddThread({
          title: 'A Thread',
          body: 'A Thread Body',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '123';
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        const addedThread = await threadRepositoryPostgres.addThread(newThread);

        const { id, title, body, owner, date } =
          await ThreadsTableTestHelper.findThreadById(addedThread.id);

        const expectedThread = {
          id: 'thread-123',
          title: 'A Thread',
          body: 'A Thread Body',
          owner: 'user-123',
          date,
        };

        expect(id).toEqual(expectedThread.id);
        expect(title).toEqual(expectedThread.title);
        expect(body).toEqual(expectedThread.body);
        expect(owner).toEqual(expectedThread.owner);
        expect(date).toEqual(expectedThread.date);
        expect(addedThread).toStrictEqual(
          new AddedThread({
            id: 'thread-123',
            title: 'A Thread',
            owner: 'user-123',
          }),
        );
      });
    });

    describe('checkAvailabilityThread function', () => {
      it('should throw NotFoundError if thread not available', async () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        const threadId = 'thread-123';

        await expect(
          threadRepositoryPostgres.checkAvailabilityThread(threadId),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should not throw NotFoundError if thread available', async () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        const userId = 'user-123';
        const threadId = 'thread-123';

        await UsersTableTestHelper.addUser({ id: userId });
        await ThreadsTableTestHelper.addThread({
          id: threadId,
          owner: userId,
        });

        await expect(
          threadRepositoryPostgres.checkAvailabilityThread(threadId),
        ).resolves.not.toThrow(NotFoundError);
      });
    });

    describe('getThreadDetailById function', () => {
      it('should throw NotFoundError when thread not found', async () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        const userId = 'user-123';
        const threadId = 'thread-123';

        await UsersTableTestHelper.addUser({ id: userId });
        await ThreadsTableTestHelper.addThread({
          id: threadId,
          owner: userId,
        });

        await expect(
          threadRepositoryPostgres.getThreadDetailById('thread-321'),
        ).rejects.toThrowError(NotFoundError);
      });

      it('should return thread if found', async () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        const userId = 'user-123';
        const threadId = 'thread-123';

        await UsersTableTestHelper.addUser({
          id: userId,
        });
        await ThreadsTableTestHelper.addThread({
          id: threadId,
          owner: userId,
        });

        const returnedThread =
          await threadRepositoryPostgres.getThreadDetailById(threadId);

        expect(returnedThread).toStrictEqual({
          id: 'thread-123',
          title: 'A Thread',
          body: 'A Thread Body',
          date: returnedThread.date,
          username: 'nicolauzp',
        });
      });
    });
  });
});
