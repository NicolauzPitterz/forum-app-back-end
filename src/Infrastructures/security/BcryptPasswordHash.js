const { PasswordHash: EncryptionHelper } = require('../../Applications');
const { AuthenticationError } = require('../../Commons');

class BcryptPasswordHash extends EncryptionHelper {
  constructor(bcrypt, saltRound = 10) {
    super();
    this.bcrypt = bcrypt;
    this.saltRound = saltRound;
  }

  async hash(password) {
    return this.bcrypt.hash(password, this.saltRound);
  }

  async comparePassword(password, hashedPassword) {
    const result = await this.bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
  }
}

module.exports = BcryptPasswordHash;
