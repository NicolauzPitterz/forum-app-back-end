const { NotFoundError, AuthorizationError } = require('../../Commons');
const { ReplyRepository, AddedReply } = require('../../Domains');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { commentId, content, owner } = newReply;

    const id = `reply-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, commentId, content, owner],
    };

    const { rows } = await this.pool.query(query);
    return new AddedReply({ ...rows[0] });
  }

  async deleteReplyById(id) {
    const query = {
      text: `UPDATE replies SET "isDelete" = TRUE WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(
        'tidak dapat menghapus reply, reply tidak ditemukan',
      );
    }
  }

  async verifyReply(commentId, replyId) {
    const query = {
      text: `SELECT * FROM replies r WHERE r."commentId" = $1 AND r.id = $2`,
      values: [commentId, replyId],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('reply yang Anda cari tidak ada');
    }

    if (rows[0].isDelete === true) {
      throw new NotFoundError('reply sudah dihapus sebelumnya');
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError(
        'proses gagal karena Anda tidak mempunyai akses ke aksi ini',
      );
    }
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT r.id, r.content, CAST(r.date AS text), u.username, r."isDelete", c.id AS "commentId" FROM replies r 
            LEFT JOIN users u ON r.owner = u.id 
            LEFT JOIN comments c ON r."commentId" = c.id
            WHERE c."threadId" = $1 ORDER BY r.date ASC`,
      values: [threadId],
    };

    const { rows } = await this.pool.query(query);

    return rows;
  }
}

module.exports = ReplyRepositoryPostgres;
