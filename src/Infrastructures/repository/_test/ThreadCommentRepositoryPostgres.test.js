const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThreadComment = require('../../../Domains/thread-comments/entities/AddedThreadComment');
const ThreadComment = require('../../../Domains/thread-comments/entities/ThreadComment');
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');

describe('ThreadCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist thread comments and return added thread comments correctly', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const threadComment = new ThreadComment({
        content: 'Komentar',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedThreadComment =
        await threadCommentRepositoryPostgres.addThreadComment(threadComment);
      expect(addedThreadComment).toStrictEqual(
        new AddedThreadComment({
          id: 'comment-123',
          content: 'Komentar',
          owner: 'user-123',
        }),
      );
      const comments =
        await ThreadCommentsTableTestHelper.findThreadCommentsById(
          'comment-123',
        );
      expect(comments).toHaveLength(1);
    });
  });

  describe('deleteThread function', () => {
    it('should soft delete the thread comment correctly', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const threadComment = new ThreadComment({
        content: 'Komentar',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedThreadComment =
        await threadCommentRepositoryPostgres.addThreadComment(threadComment);

      await threadCommentRepositoryPostgres.deleteThreadComment({
        id: addedThreadComment.id,
        owner: 'user-123',
      });

      const comments =
        await ThreadCommentsTableTestHelper.findThreadCommentsById(
          addedThreadComment.id,
        );
      expect(comments).toHaveLength(0);

      const deletedComment =
        await ThreadCommentsTableTestHelper.findDeletedThreadCommentsById(
          addedThreadComment.id,
        );
      expect(deletedComment).toHaveLength(1);
      expect(deletedComment[0].is_delete).toEqual(1);
    });
  });

  describe('getThreadCommentById function', () => {
    it('should get thread comment correcly', async () => {
      const currentDate = new Date();
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addThreadComment({
        date: currentDate,
      });

      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, () => '123');

      const comment =
        await threadCommentRepositoryPostgres.getThreadCommentById(
          'comment-123',
        );
      expect(comment.id).toEqual('comment-123');
      expect(comment.username).toEqual('dicoding');
      expect(comment.content).toEqual('Komentar');
      expect(typeof comment.date).toBe('string');
      expect(new Date(comment.date)).toEqual(currentDate);
    });
    it("should throrw not found error when thread comment doesn't exist", async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, () => '123');

      await expect(
        threadCommentRepositoryPostgres.getThreadCommentById('not-found-123'),
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getThreadCommentByThreadId function', () => {
    it('should return comment based on thread id correctly', async () => {
      const currentDate = new Date();
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addThreadComment({
        date: currentDate,
      });
      const newDate = new Date();
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: 'comment-1234',
        date: newDate,
      });

      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, () => '123');

      const comments =
        await threadCommentRepositoryPostgres.getThreadCommentByThreadId(
          'thread-123',
        );
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].username).toEqual('dicoding');
      expect(comments[0].content).toEqual('Komentar');
      expect(typeof comments[0].date).toBe('string');
      expect(comments[0].date).not.toEqual('');
      expect(new Date(comments[0].date)).toEqual(currentDate);
      expect(comments[1].id).toEqual('comment-1234');
      expect(comments[1].username).toEqual('dicoding');
      expect(comments[1].content).toEqual('Komentar');
      expect(typeof comments[1].date).toBe('string');
      expect(comments[1].date).not.toEqual('');
      expect(new Date(comments[1].date)).toEqual(newDate);
    });
  });

  describe('verifyThreadCommentOwner', () => {
    it('should throw unauthorized error when delete by other user', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addThreadComment({});

      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, () => '123');

      await expect(
        threadCommentRepositoryPostgres.verifyThreadCommentOwner({
          id: 'comment-123',
          owner: 'user-1234',
        }),
      ).rejects.toThrowError(AuthorizationError);
    });
    it("should throw not found error when thread comment doesn't exist", async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, () => '123');

      await expect(
        threadCommentRepositoryPostgres.verifyThreadCommentOwner({
          id: 'comment-123',
          owner: 'user-1234',
        }),
      ).rejects.toThrowError(NotFoundError);
    });
    it('should not throw error when delete existing comment by authorized user', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addThreadComment({});

      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, () => '123');

      await expect(
        threadCommentRepositoryPostgres.verifyThreadCommentOwner({
          id: 'comment-123',
          owner: 'user-123',
        }),
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('verifyThreadCommentAvailability', () => {
    it('should throw not found error when comment is not available', async () => {
      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, () => '123');

      await expect(
        threadCommentRepositoryPostgres.verifyThreadCommentAvailability(
          'comment-124',
        ),
      ).rejects.toThrowError(NotFoundError);
    });
    it('should throw not found error when comment is not available', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addThreadComment({});

      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, () => '123');

      await expect(
        threadCommentRepositoryPostgres.verifyThreadCommentAvailability(
          'comment-123',
        ),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
