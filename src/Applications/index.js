/* istanbul ignore file */

const AuthenticationTokenManager = require('./security/AuthenticationTokenManager');
const PasswordHash = require('./security/PasswordHash');

const AddUserUseCase = require('./use_case/users/AddUserUseCase');

const DeleteAuthenticationUseCase = require('./use_case/authentications/DeleteAuthenticationUseCase');
const LoginUserUseCase = require('./use_case/authentications/LoginUserUseCase');
const LogoutUserUseCase = require('./use_case/authentications/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('./use_case/authentications/RefreshAuthenticationUseCase');

const AddThreadUseCase = require('./use_case/threads/AddThreadUseCase');
const GetThreadDetailUseCase = require('./use_case/threads/GetThreadDetailUseCase');

const AddCommentUseCase = require('./use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('./use_case/comments/DeleteCommentUseCase');

const AddReplyUseCase = require('./use_case/reply/AddReplyUseCase');
const DeleteReplyUseCase = require('./use_case/reply/DeleteReplyUseCase');

const LikeCommentUseCase = require('./use_case/likes/LikeCommentUseCase');

module.exports = {
  AuthenticationTokenManager,
  PasswordHash,
  AddUserUseCase,
  DeleteAuthenticationUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  RefreshAuthenticationUseCase,
  AddThreadUseCase,
  GetThreadDetailUseCase,
  AddCommentUseCase,
  DeleteCommentUseCase,
  AddReplyUseCase,
  DeleteReplyUseCase,
  LikeCommentUseCase,
};
