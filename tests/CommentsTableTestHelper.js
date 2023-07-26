/* instanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    content = 'A Thread Comment',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4)',
      values: [id, threadId, content, owner],
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

  async findCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.date, c.content FROM comments c LEFT JOIN users u ON c.owner = u.id WHERE c."threadId" = $1`,
      values: [threadId],
    };

    const { rows } = await pool.query(query);
    return rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
