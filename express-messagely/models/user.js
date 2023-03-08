/** User class for message.ly */

const bcrypt = require('bcrypt');

const ExpressError = require('../expressError');
const db = require('../db');
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require('../config');

/** User of the site. */

// CREATE TABLE users (
//   username text PRIMARY KEY,
//   password text NOT NULL,
//   first_name text NOT NULL,
//   last_name text NOT NULL,
//   phone text NOT NULL,
//   join_at timestamp without time zone NOT NULL,
//   last_login_at timestamp with time zone
// );

class User {

  static tablename = 'users';

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) {
      const hashed_pwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
      const result = await db.query(`
        INSERT INTO ${User.tablename}
          (username, password, first_name, last_name, phone, join_at, last_login_at)
        VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
        RETURNING username, password, first_name, last_name, phone`,
        [username, hashed_pwd, first_name, last_name, phone]
      );

      return result.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
      const result = await db.query(`
        SELECT password
        FROM ${User.tablename}
        WHERE username = $1`,
        [username]
      );

      if (result.rows.length === 0) {
        return false;
        // throw new ExpressError('Bad username/password', 401);
      }

      return await bcrypt.compare(password, result.rows[0].password);
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
      const result = await db.query(`
        UPDATE ${User.tablename}
        SET last_login_at = $1
        WHERE username = $2
        RETURNING username`,
        [new Date(), username]
      );

      if (result.rows.length === 0) {
        throw new ExpressError(`username not found: ${username}`, 404);
      }

      // return next(); // TODO no return?
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
      const result = await db.query(`
        SELECT
          username,
          first_name,
          last_name,
          phone
        FROM ${User.tablename}`
      );

      return result.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
      const result = await db.query(`
        SELECT
          username,
          first_name,
          last_name,
          phone,
          join_at,
          last_login_at
        FROM ${User.tablename}
        WHERE username = $1`,
        [username]
      );

      if (result.rows.length === 0) {
        throw new ExpressError(`username not found: ${username}`, 404);
      }

      return result.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const result = await db.query(`
      SELECT
        m.id,
        m.body,
        m.sent_at,
        m.read_at,
        u.username,
        u.first_name,
        u.last_name,
        u.phone
      FROM messages AS m
      JOIN ${User.tablename} AS u
        ON m.from_username = $1
      WHERE u.username = m.to_username`,
      [username]
    ); // TODO error if no user?

    const messageList = result.rows.map(m => {
      return {
        id: m.id,
        to_user: {
          username: m.username,
          first_name: m.first_name,
          last_name: m.last_name,
          phone: m.phone,
        },
        body: m.body,
        sent_at: m.sent_at,
        read_at: m.read_at,
      }
    });
    // TODO transform
    return messageList;
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const result = await db.query(`
      SELECT
        m.id,
        m.body,
        m.sent_at,
        m.read_at,
        u.username,
        u.first_name,
        u.last_name,
        u.phone
      FROM messages AS m
      JOIN ${User.tablename} AS u
        ON m.to_username = $1
      WHERE u.username = m.from_username`,
      [username]
    ); // TODO error if no user?

    const messageList = result.rows.map(m => {
      return {
        id: m.id,
        from_user: {
          username: m.username,
          first_name: m.first_name,
          last_name: m.last_name,
          phone: m.phone,
        },
        body: m.body,
        sent_at: m.sent_at,
        read_at: m.read_at,
      }
    });
    // TODO transform
    return messageList;
  }
}


module.exports = User;