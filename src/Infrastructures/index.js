const pool = require('./database/postgres/pool');

const createServer = require('./http/createServer');

const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');

const BcryptEncryptionHelper = require('./security/BcryptPasswordHash');
const JwtTokenManager = require('./security/JwtTokenManager');

module.exports = {
  pool,
  createServer,
  AuthenticationRepositoryPostgres,
  ThreadRepositoryPostgres,
  UserRepositoryPostgres,
  BcryptEncryptionHelper,
  JwtTokenManager,
};
