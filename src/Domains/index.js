/* istanbul ignore file */

const AuthenticationRepository = require('./authentications/AuthenticationRepository');
const NewAuth = require('./authentications/entities/NewAuth');

const RegisterUser = require('./users/entities/RegisterUser');
const RegisteredUser = require('./users/entities/RegisteredUser');
const UserLogin = require('./users/entities/UserLogin');
const UserRepository = require('./users/UserRepository');

const AddThread = require('./threads/entities/AddThread');
const AddedThread = require('./threads/entities/AddedThread');
const ThreadDetail = require('./threads/entities/ThreadDetail');
const ThreadRepository = require('./threads/ThreadRepository');

const AddComment = require('./comments/entities/AddComment');
const AddedComment = require('./comments/entities/AddedComment');
const CommentDetail = require('./comments/entities/CommentDetail');
const CommentRepository = require('./comments/CommentRepository');

const AddReply = require('./replies/entities/AddReply');
const AddedReply = require('./replies/entities/AddedReply');
const ReplyDetail = require('./replies/entities/ReplyDetail');
const ReplyRepository = require('./replies/ReplyRepository');

module.exports = {
  AuthenticationRepository,
  NewAuth,
  RegisterUser,
  RegisteredUser,
  UserLogin,
  UserRepository,
  AddThread,
  AddedThread,
  ThreadDetail,
  ThreadRepository,
  AddComment,
  AddedComment,
  CommentDetail,
  CommentRepository,
  AddReply,
  AddedReply,
  ReplyDetail,
  ReplyRepository,
};
