const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThreadComment = require('../../Domains/thread-comments/entities/AddedThreadComment');
const ThreadCommentDetail = require('../../Domains/thread-comments/entities/ThreadCommentDetail');
const ThreadCommentRepository = require('../../Domains/thread-comments/ThreadCommentRepository');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThreadComment(threadComment) {
    const { owner, threadId, content } = threadComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO thread_comments(id, content, thread_id, owner) VALUES($1, $2, $3, $4) RETURNING content, id, owner',
      values: [id, content, threadId, owner],
    };
    const result = await this._pool.query(query);
    return new AddedThreadComment({ ...result.rows[0] });
  }

  async getThreadCommentById(id) {
    const query = {
      text: `
        SELECT tc.*, u.username
        FROM thread_comments tc
        JOIN users u ON u.id = tc.owner 
        WHERE tc.id = $1
      `,
      values: [id],
    };
    const { rows, rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
    return new ThreadCommentDetail(rows[0]);
  }

  async getThreadCommentByThreadId(threadId) {
    const query = {
      text: `
        SELECT tc.*, u.username
        FROM thread_comments tc
        JOIN users u ON u.id = tc.owner 
        WHERE tc.thread_id = $1
        ORDER BY tc.date ASC
      `,
      values: [threadId],
    };
    const { rows } = await this._pool.query(query);
    return rows.map((item) => new ThreadCommentDetail(item));
  }

  async deleteThreadComment({ id }) {
    const query = {
      text: 'UPDATE thread_comments SET is_delete = 1 WHERE id = $1 RETURNING id',
      values: [id],
    };
    await this._pool.query(query);
  }

  async verifyThreadCommentOwner({ id, owner }) {
    const query = {
      text: 'SELECT owner FROM thread_comments WHERE id = $1',
      values: [id],
    };
    const { rowCount, rows } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
    const threadOwner = rows[0].owner;
    if (owner !== threadOwner) {
      throw new AuthorizationError('anda tidak berhak menghapus resource ini');
    }
  }
}

module.exports = ThreadCommentRepositoryPostgres;
