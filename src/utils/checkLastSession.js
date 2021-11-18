import jwt from 'jsonwebtoken';
import connection from '../database/database.js';

const checkLastSession = async (token) => {
  const result = await connection.query(
    'SELECT * FROM sessions WHERE token = $1',
    [token]
  );

  if (result.rowCount !== 0) {
    const userId = result.rows[0].user_id;
    const lastSession = await connection.query(
      'SELECT * FROM sessions WHERE user_id = $1 ORDER BY ID DESC LIMIT 1',
      [userId]
    );
    const lastSessionToken = lastSession.rows[0].token;

    if (lastSessionToken === token) {
      const session = await connection.query(
        'INSERT INTO sessions (user_id) VALUES ($1) RETURNING id',
        [userId]
      );
      const sessionId = session.rows[0].id;

      const jwtSecret = process.env.JWT_SECRET;
      const configurations = { expiresIn: 60 * 15 };
      const newToken = jwt.sign({ sessionId }, jwtSecret, configurations);

      await connection.query('UPDATE sessions SET token = $1 WHERE id = $2', [
        newToken,
        sessionId,
      ]);

      return { newToken, sessionId };
    }
  }

  return false;
};

export default checkLastSession;
