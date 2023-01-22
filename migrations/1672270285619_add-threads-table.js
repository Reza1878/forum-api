/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR',
    },
    body: {
      type: 'TEXT',
    },
    owner: {
      type: 'VARCHAR',
      references: '"users"',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
