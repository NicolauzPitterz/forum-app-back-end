/* istanbul ignore file */

const users = require('./http/api/users');
const authentications = require('./http/api/authentications');
const threads = require('./http/api/threads');
const comments = require('./http/api/comments');
const replies = require('./http/api/replies');
const likes = require('./http/api/likes');

module.exports = {
  users,
  authentications,
  threads,
  comments,
  replies,
  likes,
};
