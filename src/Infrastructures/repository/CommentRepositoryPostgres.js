const { NotFoundError, AuthorizationError } = require('../../Commons');
const { CommentRepository, AddedComment } = require('../../Domains');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, content, owner } = newComment;

    const id = `comment-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, threadId, content, owner],
    };

    const { rows } = await this.pool.query(query);
    return new AddedComment({ ...rows[0] });
  }

  async deleteCommentById(id) {
    const query = {
      text: `UPDATE comments SET "isDelete" = TRUE WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new NotFoundError(
        'tidak dapat menghapus comment, comment tidak ditemukan',
      );
    }
  }

  async verifyComment(threadId, commentId) {
    const query = {
      text: `SELECT * FROM comments c WHERE c."threadId" = $1 AND c.id = $2`,
      values: [threadId, commentId],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('comment yang Anda cari tidak ada');
    }

    if (rows[0].isDelete === true) {
      throw new NotFoundError('comment sudah dihapus sebelumnya');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const { rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError(
        'proses gagal karena Anda tidak mempunyai akses ke aksi ini',
      );
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, u.username, CAST(c.date AS text), c.content, c."isDelete" FROM comments c LEFT JOIN users u ON c.owner = u.id WHERE c."threadId" = $1 ORDER BY c.date ASC`,
      values: [threadId],
    };

    const { rows } = await this.pool.query(query);

    return rows;
  }
}

module.exports = CommentRepositoryPostgres;
