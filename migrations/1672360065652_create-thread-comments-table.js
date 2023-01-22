/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('thread_comments', {
    id: {
      type: 'VARCHAR',
    },
    content: {
      type: 'TEXT',
    },
    owner: {
      type: 'VARCHAR',
      references: '"users"',
      onDelete: 'CASCADE',
    },
    thread_id: {
      type: 'VARCHAR',
      references: '"threads"',
      onDelete: 'CASCADE',
    },
    is_delete: {
      type: 'INTEGER',
      default: 0,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comments');
};
