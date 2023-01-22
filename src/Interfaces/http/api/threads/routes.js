const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'base_auth',
    },
  },
  {
    method: 'GET',
    path: '/threads/{id}',
    handler: handler.getThreadByIdHandler,
  },
];

module.exports = routes;
