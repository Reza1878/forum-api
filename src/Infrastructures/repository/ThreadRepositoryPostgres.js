const NotFoundError = require('../../Commons/exceptions/NotFoundError');
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

    return new ThreadDetail({ ...result.rows[0], comments: [] });
  }
}

module.exports = ThreadRepositoryPostgres;
