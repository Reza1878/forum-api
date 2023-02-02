const routes = (handler) => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putThreadCommentLikeHandler,
    options: {
      auth: 'base_auth',
    },
  },
];

module.exports = routes;
