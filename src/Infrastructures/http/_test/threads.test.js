const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('/threads endpoint', () => {
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
  });
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 401 missing authentication', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread title',
        body: 'Thread body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });
    it('should response 400 when given invalid payload', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread title',
      };
      const server = await createServer(container);

      // Action
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
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(typeof responseJson.message).toEqual('string');
      expect(responseJson.message).not.toEqual('');
    });

    it('should response 201 and persisted thread', async () => {
      const requestPayload = {
        title: 'Thread title',
        body: 'Thread body',
      };
      const server = await createServer(container);

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
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe('when GET /threads/{id}', () => {
    it('should response 200', async () => {
      const requestPayload = {
        title: 'Thread title',
        body: 'Thread body',
      };
      const server = await createServer(container);

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
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      const { id } = responseJson.data.addedThread;

      const responseGet = await server.inject({
        method: 'GET',
        url: `/threads/${id}`,
      });
      const responseGetJson = JSON.parse(responseGet.payload);
      expect(responseGet.statusCode).toEqual(200);
      expect(responseGetJson.data.thread).toBeDefined();
    });
  });
});
