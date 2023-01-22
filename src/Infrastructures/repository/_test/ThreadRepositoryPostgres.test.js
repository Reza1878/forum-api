const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const Thread = require('../../../Domains/threads/entities/Thread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should return addedThread object correctly', async () => {
      await UsersTableTestHelper.addUser({});
      const addThread = new Thread({
        title: 'title',
        body: 'body thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const addedThread = await threadRepositoryPostgres.addThread(addThread);
      const expectedAddedThread = new AddedThread({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner: 'user-123',
      });

      expect(addedThread).toStrictEqual(expectedAddedThread);
    });

    it('should persist thread', async () => {
      await UsersTableTestHelper.addUser({});
      const addThread = new Thread({
        title: 'title',
        body: 'body thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await threadRepositoryPostgres.addThread(addThread);

      const threads = await ThreadsTableTestHelper.findThreadsById(
        'thread-123',
      );
      expect(threads).toHaveLength(1);
    });
  });

  describe('getThreadById function', () => {
    it('should return the right thread', async () => {
      const currentDate = new Date();
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ date: currentDate });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const threadDetail = await threadRepositoryPostgres.getThreadById(
        'thread-123',
      );

      expect(threadDetail.id).toEqual('thread-123');
      expect(threadDetail.title).toEqual('title');
      expect(threadDetail.body).toEqual('body');
      expect(threadDetail.username).toEqual('dicoding');
      expect(typeof threadDetail.date).toEqual('string');
      expect(threadDetail.date).not.toEqual('');
      expect(new Date(threadDetail.date)).toEqual(currentDate);
      expect(threadDetail.comments).toHaveLength(0);
      expect(threadDetail.username).toEqual('dicoding');
      expect(typeof threadDetail.date).toEqual('string');
      expect(threadDetail.date).not.toEqual('');
    });
    it('should return the right thread with comments', async () => {
      const currentDate = new Date();
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ date: currentDate });
      await ThreadCommentsTableTestHelper.addThreadComment({
        date: currentDate,
      });
      const newDate = new Date();
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: 'comment-1234',
        date: newDate,
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      const threadDetail = await threadRepositoryPostgres.getThreadById(
        'thread-123',
      );
      expect(threadDetail.id).toEqual('thread-123');
      expect(threadDetail.title).toEqual('title');
      expect(threadDetail.body).toEqual('body');
      expect(threadDetail.username).toEqual('dicoding');
      expect(typeof threadDetail.date).toEqual('string');
      expect(threadDetail.date).not.toEqual('');
      expect(new Date(threadDetail.date)).toEqual(currentDate);
      expect(threadDetail.comments).toHaveLength(2);
      expect(threadDetail.comments[0].id).toEqual('comment-123');
      expect(threadDetail.comments[0].username).toEqual('dicoding');
      expect(threadDetail.comments[0].content).toEqual('Komentar');
      expect(typeof threadDetail.comments[0].date).toBe('string');
      expect(threadDetail.comments[0].date).not.toEqual('');
      expect(new Date(threadDetail.comments[0].date)).toEqual(currentDate);
      expect(threadDetail.comments[1].id).toEqual('comment-1234');
      expect(threadDetail.comments[1].username).toEqual('dicoding');
      expect(threadDetail.comments[1].content).toEqual('Komentar');
      expect(typeof threadDetail.comments[1].date).toBe('string');
      expect(threadDetail.comments[1].date).not.toEqual('');
      expect(new Date(threadDetail.comments[1].date)).toEqual(newDate);
    });
    it("should return not found error when thread doesn't exist", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => '123',
      );
      await expect(
        threadRepositoryPostgres.getThreadById('not-found-id'),
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyThreadAvailability function', () => {
    it("should throw not found error when thread doesn't exist", async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => '123',
      );
      await expect(
        threadRepositoryPostgres.getThreadById('not-found-id'),
      ).rejects.toThrowError(NotFoundError);
    });
    it('should not trhow error when thread is exist', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => '123',
      );
      await expect(
        threadRepositoryPostgres.getThreadById('thread-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
