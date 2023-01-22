/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('threads', {
    date: {
      type: 'VARCHAR',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });
  pgm.addColumn('thread_comments', {
    date: {
      type: 'VARCHAR',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('threads', 'date');
  pgm.dropColumn('thread_comments', 'date');
};
