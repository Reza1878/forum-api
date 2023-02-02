const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}', () => {
  let accessToken = '';
  beforeAll(async () => {
    const server = await createServer(container);
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding',
      },
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const responseAuthJson = JSON.parse(responseAuth.payload);
    const { accessToken: token } = responseAuthJson.data;
    accessToken = token;
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 missing authentication', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/1/comments/{1}/likes',
      });
      expect(response.statusCode).toEqual(401);
    });
    it('should response 404 when like not found thread', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/1/comments/{1}/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toEqual(404);
    });
    it('should response 404 when like not found comment', async () => {
      const server = await createServer(container);
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Title',
          body: 'Body',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id: threadId } = responseThreadJson.data.addedThread;

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/{1}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(response.statusCode).toEqual(404);
    });
    it('should likes the comment correctly', async () => {
      const server = await createServer(container);
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Title',
          body: 'Body',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id: threadId } = responseThreadJson.data.addedThread;
      const requestPayload = {
        content: 'content',
      };

      const responseThreadComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseThreadCommentJson = JSON.parse(
        responseThreadComment.payload,
      );
      const { id: threadCommentId } =
        responseThreadCommentJson.data.addedComment;
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${threadCommentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const thread = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });
      const threadJson = JSON.parse(thread.payload);
      const threadComment = threadJson.data.thread.comments;
      expect(threadComment[0].likeCount).toEqual(1);
      expect(response.statusCode).toEqual(200);
    });
    it('should dislike comment correctly', async () => {
      const server = await createServer(container);
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Title',
          body: 'Body',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id: threadId } = responseThreadJson.data.addedThread;
      const requestPayload = {
        content: 'content',
      };

      const responseThreadComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseThreadCommentJson = JSON.parse(
        responseThreadComment.payload,
      );
      const { id: threadCommentId } =
        responseThreadCommentJson.data.addedComment;
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${threadCommentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadBefore = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });
      const threadBeforeJson = JSON.parse(threadBefore.payload);
      const threadBeforeComment = threadBeforeJson.data.thread.comments;
      expect(threadBeforeComment[0].likeCount).toEqual(1);
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${threadCommentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadAfter = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });
      const threadAfterJson = JSON.parse(threadAfter.payload);
      const threadAfterComment = threadAfterJson.data.thread.comments;
      expect(threadAfterComment[0].likeCount).toEqual(0);
    });
  });
});
