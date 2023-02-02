const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  let accessToken1 = '';
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
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding1',
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
    const { accessToken } = responseAuthJson.data;
    accessToken1 = accessToken;
  });
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 missing authentication', async () => {
      const server = await createServer(container);
      const requestPayload = {
        content: 'content',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/threads/1/comments',
        payload: requestPayload,
      });
      expect(response.statusCode).toEqual(401);
    });

    it('should response 400 when given invalid payload', async () => {
      const server = await createServer(container);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Title',
          body: 'Body',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id: threadId } = responseThreadJson.data.addedThread;
      const requestPayload = {
        // content: 'content',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(typeof responseJson.message).toEqual('string');
      expect(responseJson.message).not.toEqual('');
    });

    it('should response 201 when given valid payload', async () => {
      const server = await createServer(container);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Title',
          body: 'Body',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id: threadId } = responseThreadJson.data.addedThread;
      const requestPayload = {
        content: 'content',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 missing authentication', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/1/comments/1',
      });
      expect(response.statusCode).toEqual(401);
    });
    it('should response 404 when delete not exist thread', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/1/comments/1',
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });
    it('should response 404 when delete not exist comment', async () => {
      const server = await createServer(container);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Title',
          body: 'Body',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id: threadId } = responseThreadJson.data.addedThread;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/1`,
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });
    it('should response 403 when thread delete by other user', async () => {
      const server = await createServer(container);
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding1',
          password: 'secret',
        },
      });
      const responseAuthJson = JSON.parse(responseAuth.payload);
      const { accessToken } = responseAuthJson.data;
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Title',
          body: 'Body',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id: threadId } = responseThreadJson.data.addedThread;
      const requestPayload = {
        content: 'content',
      };

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const { id: commentId } = responseCommentJson.data.addedComment;
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'anda tidak berhak menghapus resource ini',
      );
    });
    it('should response 200 when delete by authorized user', async () => {
      const server = await createServer(container);
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Title',
          body: 'Body',
        },
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id: threadId } = responseThreadJson.data.addedThread;
      const requestPayload = {
        content: 'content',
      };

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const { id: commentId } = responseCommentJson.data.addedComment;
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken1}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
