const { NotFoundError } = require('../../Commons');
const { ThreadRepository, AddedThread } = require('../../Domains');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES ($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };

    const { rows } = await this.pool.query(query);
    return new AddedThread({ ...rows[0] });
  }

  async checkAvailabilityThread(id) {
    const query = {
      text: `SELECT * FROM threads WHERE id = $1`,
      values: [id],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThreadDetailById(id) {
    const query = {
      text: `SELECT t.id, t.title, t.body, CAST(t.date AS text), u.username FROM threads t LEFT JOIN users u ON t.owner = u.id WHERE t.id = $1`,
      values: [id],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
