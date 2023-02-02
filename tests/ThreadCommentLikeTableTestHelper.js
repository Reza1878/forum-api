/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentLikeTableTestHelper = {
  async addThreadCommentLike({
    threadCommentId = 'comment-123',
    userId = 'user-123',
    id = 'like-123',
  }) {
    const query = {
      text: 'INSERT INTO thread_comment_likes(id, thread_comment_id, user_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, threadCommentId, userId],
    };
    const { rows } = await pool.query(query);
    return rows[0].id;
  },
  async findThreadCommentLike({
    threadCommentId = 'comment-123',
    userId = 'user-123',
  }) {
    const query = {
      text: 'SELECT * FROM thread_comment_likes WHERE thread_comment_id = $1 AND user_id = $2',
      values: [threadCommentId, userId],
    };
    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    const query = {
      text: 'DELETE FROM thread_comment_likes WHERE 1 = 1',
    };
    await pool.query(query);
  },
};

module.exports = ThreadCommentLikeTableTestHelper;
