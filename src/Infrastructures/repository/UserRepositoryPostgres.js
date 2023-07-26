const { InvariantError } = require('../../Commons');
const { RegisteredUser, UserRepository } = require('../../Domains');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const { rowCount } = await this.pool.query(query);

    if (rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser(registerUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };

    const { rows } = await this.pool.query(query);
    return new RegisteredUser({ ...rows[0] });
  }

  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new InvariantError('username tidak ditemukan');
    }

    return rows[0].password;
  }

  async getIdByUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const { rows, rowCount } = await this.pool.query(query);

    if (!rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    return rows[0].id;
  }
}

module.exports = UserRepositoryPostgres;
