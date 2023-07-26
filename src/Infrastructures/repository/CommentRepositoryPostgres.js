const { CommentRepository, AddedComment } = require('../../Domains');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, owner } = newComment;

    const id = `comment-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3) RETURNING id, content, owner',
      values: [id, content, owner],
    };

    const { rows } = await this.pool.query(query);
    return new AddedComment({ ...rows[0] });
  }
}

module.exports = CommentRepositoryPostgres;
