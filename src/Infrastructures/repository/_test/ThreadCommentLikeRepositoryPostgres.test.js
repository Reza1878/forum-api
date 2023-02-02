const ThreadCommentLikeTableTestHelper = require('../../../../tests/ThreadCommentLikeTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadCommentLike = require('../../../Domains/thread-comment-likes/entities/ThreadCommentLike');
const ThreadCommentLikeRepositoryPostgres = require('../ThreadCommentLikeRepositoryPostgres');
const pool = require('../../database/postgres/pool');

describe('ThreadCommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadCommentLikeTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThreadCommentLike function', () => {
    it('should persist thread comment likes correctly', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addThreadComment({});
      const threadCommentLike = new ThreadCommentLike({
        threadId: 'thread-123',
        threadCommentId: 'comment-123',
        userId: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadCommentLikeRepositoryPostgres =
        new ThreadCommentLikeRepositoryPostgres(pool, fakeIdGenerator);
      threadCommentLikeRepositoryPostgres.addThreadCommentLike(
        threadCommentLike,
      );
      const likes =
        await ThreadCommentLikeTableTestHelper.findThreadCommentLike(
          threadCommentLike,
        );
      expect(likes.length).toBe(1);
    });
  });

  describe('deleteThreadCommentLike function', () => {
    it('should delete the thread comment like correctly', async () => {
      const threadCommentLike = new ThreadCommentLike({
        threadId: 'thread-123',
        threadCommentId: 'comment-123',
        userId: 'user-123',
      });

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addThreadComment({});
      await ThreadCommentLikeTableTestHelper.addThreadCommentLike({});

      const likesBefore =
        await ThreadCommentLikeTableTestHelper.findThreadCommentLike({});
      const fakeIdGenerator = () => '123';
      const threadCommentLikeRepositoryPostgres =
        new ThreadCommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      await threadCommentLikeRepositoryPostgres.deleteThreadCommentLike(
        threadCommentLike,
      );

      const likesAfter =
        await ThreadCommentLikeTableTestHelper.findThreadCommentLike({});

      expect(likesBefore.length).toBe(1);
      expect(likesAfter.length).toBe(0);
    });
  });

  describe('verifyThreadCommentLike function', () => {
    it('should verify comment liked correctly', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await ThreadCommentsTableTestHelper.addThreadComment({});
      await ThreadCommentLikeTableTestHelper.addThreadCommentLike({});

      const fakeIdGenerator = () => '123';
      const threadCommentLikeRepositoryPostgres =
        new ThreadCommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      await expect(
        threadCommentLikeRepositoryPostgres.verifyCommentLikes({
          threadCommentId: 'comment-123',
          userId: 'user-123',
        }),
      ).resolves.toBe(true);
      await expect(
        threadCommentLikeRepositoryPostgres.verifyCommentLikes({
          threadCommentId: 'comment-123',
          userId: 'user-124',
        }),
      ).resolves.toBe(false);
    });
  });
});
