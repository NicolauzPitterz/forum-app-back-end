/* istanbul ignore file */

const container = require('./container');

const pool = require('./database/postgres/pool');

const createServer = require('./http/createServer');

const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const LikeRepositoryPostgres = require('./repository/LikeRepositoryPostgres');
const ReplyRepositoryPostgres = require('./repository/ReplyRepositoryPostgres');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');

const BcryptEncryptionHelper = require('./security/BcryptPasswordHash');
const JwtTokenManager = require('./security/JwtTokenManager');

module.exports = {
  container,
  pool,
  createServer,
  AuthenticationRepositoryPostgres,
  CommentRepositoryPostgres,
  LikeRepositoryPostgres,
  ReplyRepositoryPostgres,
  ThreadRepositoryPostgres,
  UserRepositoryPostgres,
  BcryptEncryptionHelper,
  JwtTokenManager,
};
