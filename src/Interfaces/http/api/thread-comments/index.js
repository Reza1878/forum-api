const ThreadCommentsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'thread-comments',
  version: '1.0.0',
  register: (server, { container }) => {
    const handler = new ThreadCommentsHandler(container);
    server.route(routes(handler));
  },
};
