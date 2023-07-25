const AuthenticationRepository = require('./authentications/AuthenticationRepository');
const NewAuth = require('./authentications/entities/NewAuth');

const RegisterUser = require('./users/entities/RegisterUser');
const RegisteredUser = require('./users/entities/RegisteredUser');
const UserLogin = require('./users/entities/UserLogin');
const UserRepository = require('./users/UserRepository');

const AddThread = require('./threads/entities/AddThread');
const AddedThread = require('./threads/entities/AddedThread');
const ThreadRepository = require('./threads/ThreadRepository');

module.exports = {
  AuthenticationRepository,
  NewAuth,
  RegisterUser,
  RegisteredUser,
  UserLogin,
  UserRepository,
  AddThread,
  AddedThread,
  ThreadRepository,
};
