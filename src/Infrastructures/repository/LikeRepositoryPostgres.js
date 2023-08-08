const { NotFoundError } = require('../../Commons');
const { LikeRepository } = require('../../Domains');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addLike(newLike) {
    const { commentId, owner } = newLike;

    const id = `like-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id',
      values: [id, commentId, owner],
    };

    const { rows } = await this.pool.query(query);
    return rows[0];
  }

  async deleteLikeById(id) {
    const query = {
      text: 'DELETE FROM likes WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(
        'tidak dapat menghapus like, like tidak ditemukan',
      );
    }
  }

  async verifyLike(commentId, owner) {
    const query = {
      text: `SELECT id FROM likes WHERE "commentId" = $1 AND owner = $2`,
      values: [commentId, owner],
    };

    const { rows } = await this.pool.query(query);

    return rows[0];
  }

  async getLikesByCommentId(commentId) {
    const query = {
      text: `SELECT COUNT(*)::int FROM likes WHERE "commentId" = $1`,
      values: [commentId],
    };

    const { rows } = await this.pool.query(query);

    return rows[0].count;
  }
}

module.exports = LikeRepositoryPostgres;
