/* istanbul ignore file */

const RegisterUser = require('./users/entities/RegisterUser');
const RegisteredUser = require('./users/entities/RegisteredUser');
const UserLogin = require('./users/entities/UserLogin');
const UserRepository = require('./users/UserRepository');

const NewAuth = require('./authentications/entities/NewAuth');
const AuthenticationRepository = require('./authentications/AuthenticationRepository');

const AddThread = require('./threads/entities/AddThread');
const AddedThread = require('./threads/entities/AddedThread');
const ThreadDetail = require('./threads/entities/ThreadDetail');
const ThreadRepository = require('./threads/ThreadRepository');

const AddComment = require('./comments/entities/AddComment');
const AddedComment = require('./comments/entities/AddedComment');
const CommentDetail = require('./comments/entities/CommentDetail');
const FilteredComments = require('./comments/entities/FilteredComments');
const CommentReplies = require('./comments/entities/CommentReplies');
const CommentRepository = require('./comments/CommentRepository');

const AddReply = require('./replies/entities/AddReply');
const AddedReply = require('./replies/entities/AddedReply');
const ReplyDetail = require('./replies/entities/ReplyDetail');
const FilteredReplies = require('./replies/entities/FilteredReplies');
const ReplyRepository = require('./replies/ReplyRepository');

const AddLike = require('./likes/entities/AddLike');
const LikeRepository = require('./likes/LikeRepository');

module.exports = {
  RegisterUser,
  RegisteredUser,
  UserLogin,
  UserRepository,
  NewAuth,
  AuthenticationRepository,
  AddThread,
  AddedThread,
  ThreadDetail,
  ThreadRepository,
  AddComment,
  AddedComment,
  CommentDetail,
  FilteredComments,
  CommentReplies,
  CommentRepository,
  AddReply,
  AddedReply,
  ReplyDetail,
  FilteredReplies,
  ReplyRepository,
  AddLike,
  LikeRepository,
};
