/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    content = 'A Thread Comment',
    owner = 'user-123',
    isDelete = false,
  }) {
    const query = {
      text: `INSERT INTO comments (id, "threadId", content, owner, "isDelete") VALUES($1, $2, $3, $4, $5)`,
      values: [id, threadId, content, owner, isDelete],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
