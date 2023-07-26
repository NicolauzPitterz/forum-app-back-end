/* istanbul ignore file */

const AuthenticationError = require('./exceptions/AuthenticationError');
const AuthorizationError = require('./exceptions/AuthorizationError');
const ClientError = require('./exceptions/ClientError');
const DomainErrorTranslator = require('./exceptions/DomainErrorTranslator');
const InvariantError = require('./exceptions/InvariantError');
const NotFoundError = require('./exceptions/NotFoundError');

module.exports = {
  AuthenticationError,
  AuthorizationError,
  ClientError,
  DomainErrorTranslator,
  InvariantError,
  NotFoundError,
};
