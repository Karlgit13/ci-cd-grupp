const pool = require('../config/db');

class User {
  static async create(username, email, hashedPassword) {
    return null;
  }

  static async findByEmail(email) {
    return null;
  }

  static async findById(id) {
    return null;
  }
}

module.exports = User;

