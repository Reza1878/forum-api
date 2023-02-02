const ThreadCommentLikeRepository = require('../../Domains/thread-comment-likes/ThreadCommentLikeRepository');

class ThreadCommentLikeRepositoryPostgres extends ThreadCommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThreadCommentLike(payload) {
    const { threadCommentId, userId } = payload;
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO thread_comment_likes(id, thread_comment_id, user_id) VALUES($1, $2, $3)',
      values: [id, threadCommentId, userId],
    };
    await this._pool.query(query);
    return id;
  }

  async deleteThreadCommentLike({ threadCommentId, userId }) {
    const query = {
      text: 'DELETE FROM thread_comment_likes WHERE thread_comment_id = $1 AND user_id = $2',
      values: [threadCommentId, userId],
    };
    await this._pool.query(query);
  }

  async verifyCommentLikes({ threadCommentId, userId }) {
    const query = {
      text: 'SELECT id FROM thread_comment_likes WHERE thread_comment_id = $1 AND user_id = $2',
      values: [threadCommentId, userId],
    };
    const { rowCount } = await this._pool.query(query);
    return rowCount !== 0;
  }
}

module.exports = ThreadCommentLikeRepositoryPostgres;
