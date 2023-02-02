const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadCommentDetail = require('../../Domains/thread-comments/entities/ThreadCommentDetail');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread({ title, body, owner, date = new Date() }) {
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads (id, title, body, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };
    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyThreadAvailability(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }

  async getThreadById(id) {
    const query = {
      text: `
        SELECT t.*, u.username 
        FROM threads t 
        JOIN users u ON u.id = t.owner
        WHERE t.id = $1
      `,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    const commentQuery = {
      text: `
        SELECT tc.*, u.username, COALESCE(COUNT(tcl.id), 0) as like_count
        FROM thread_comments tc
        JOIN users u ON u.id = tc.owner 
        LEFT JOIN thread_comment_likes tcl ON tcl.thread_comment_id = tc.id
        WHERE tc.thread_id = $1
        GROUP BY tc.id, tc.content, tc.owner, tc.thread_id, tc.is_delete, tc.date, u.username
        ORDER BY tc.date ASC
      `,
      values: [id],
    };
    const commentResult = await this._pool.query(commentQuery);
    // eslint-disable-next-line arrow-body-style
    const comments = commentResult.rows.map((comment) => {
      return new ThreadCommentDetail({
        ...comment,
        likeCount: +comment.like_count,
      });
    });
    return new ThreadDetail({ ...result.rows[0], comments });
  }
}

module.exports = ThreadRepositoryPostgres;
