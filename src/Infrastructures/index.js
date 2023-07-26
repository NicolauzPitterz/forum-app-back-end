const container = require('./container');

const pool = require('./database/postgres/pool');

const createServer = require('./http/createServer');

const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
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
  ThreadRepositoryPostgres,
  UserRepositoryPostgres,
  BcryptEncryptionHelper,
  JwtTokenManager,
};
