/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    content = 'A Comment Reply',
    owner = 'user-123',
    isDelete = false,
  }) {
    const query = {
      text: `INSERT INTO replies (id, "commentId", content, owner, "isDelete") VALUES($1, $2, $3, $4, $5)`,
      values: [id, commentId, content, owner, isDelete],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
