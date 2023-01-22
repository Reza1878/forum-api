/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async addThreadComment({
    id = 'comment-123',
    content = 'Komentar',
    owner = 'user-123',
    threadId = 'thread-123',
    date = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO thread_comments(id, content, owner, thread_id, date) VALUES($1, $2, $3, $4, $5)',
      values: [id, content, owner, threadId, date],
    };
    await pool.query(query);
  },

  async findThreadCommentsById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1 AND is_delete = 0',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async findDeletedThreadCommentsById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1 AND is_delete = 1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comments WHERE 1 = 1');
  },
};

module.exports = ThreadCommentsTableTestHelper;
