import { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import connection from '../database/database.js';
import signInSchema from '../schemas/signInSchema.js';

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.sendStatus(400);
  }

  const validation = signInSchema.validate(req.body);

  if (validation.error) {
    return res.sendStatus(400);
  }

  try {
    const result = await connection.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    const { id } = result.rows[0];

    if (compareSync(password, result.rows[0].password)) {
      const session = await connection.query(
        'INSERT INTO sessions (user_id) VALUES ($1) RETURNING id',
        [id]
      );
      const sessionId = session.rows[0].id;

      const jwtSecret = process.env.JWT_SECRET;
      const configurations = { expiresIn: 60 * 15 };
      const token = jwt.sign({ sessionId }, jwtSecret, configurations);

      await connection.query('UPDATE sessions SET token = $1 WHERE id = $2', [
        token,
        sessionId,
      ]);

      return res.status(200).send({ token });
    }

    return res.sendStatus(401);
  } catch {
    return res.sendStatus(500);
  }
};

export default signIn;
