/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('thread_comment_likes', {
    id: 'VARCHAR',
    user_id: 'VARCHAR',
    thread_comment_id: 'VARCHAR',
  });
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comment_likes');
};
