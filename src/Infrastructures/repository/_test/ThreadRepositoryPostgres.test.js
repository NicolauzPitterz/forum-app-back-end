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

        const threads = await ThreadsTableTestHelper.findThreadById(
          addedThread.id,
        );
        expect(threads).toBeDefined();
        expect(addedThread).toStrictEqual(
          new AddedThread({
            id: 'thread-123',
            title: 'A Thread',
            owner: 'user-123',
          }),
        );
      });
    });

    describe('getThreadDetailById function', () => {
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

      it('should return thread if found', async () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        await UsersTableTestHelper.addUser({
          id: 'user-123',
          username: 'nicolauzp',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          title: 'A Thread',
          body: 'A Thread Body',
          owner: 'user-123',
        });

        const returnedThread =
          await threadRepositoryPostgres.getThreadDetailById('thread-123');

        const expectedThread = {
          id: 'thread-123',
          title: 'A Thread',
          body: 'A Thread Body',
          date: returnedThread.date,
          username: 'nicolauzp',
        };
        expect(returnedThread).toStrictEqual(expectedThread);
      });
    });
  });
});
