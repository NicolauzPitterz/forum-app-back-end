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

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.date, c.content FROM comments c LEFT JOIN users u ON c.owner = u.id WHERE c."threadId" = $1`,
      values: [threadId],
    };

    const { rows } = await this.pool.query(query);

    return rows;
  }
}

module.exports = CommentRepositoryPostgres;
