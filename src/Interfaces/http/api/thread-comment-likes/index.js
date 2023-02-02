const ThreadCommentLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'thread-comment-likes',
  version: '1.0.0',
  register: (server, { container }) => {
    const handler = new ThreadCommentLikesHandler(container);
    server.route(routes(handler));
  },
};
