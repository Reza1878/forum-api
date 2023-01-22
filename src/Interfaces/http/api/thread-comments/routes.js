const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postThreadCommentHandler,
    options: {
      auth: 'base_auth',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteThreadCommentHandler,
    options: {
      auth: 'base_auth',
    },
  },
];

module.exports = routes;
