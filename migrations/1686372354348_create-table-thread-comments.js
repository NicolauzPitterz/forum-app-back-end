/* eslint-disable quotes */
/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('thread_comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    threadId: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
    commentId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'thread_comments',
    'fk_thread_comments.threadId_threads.id',
    `FOREIGN KEY("threadId") REFERENCES threads(id) ON DELETE CASCADE`,
  );

  pgm.addConstraint(
    'thread_comments',
    'fk_thread_comments.commentId_comments.id',
    `FOREIGN KEY("commentId") REFERENCES comments(id) ON DELETE CASCADE`,
  );
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comments');
};
