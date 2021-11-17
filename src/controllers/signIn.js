import { compareSync } from 'bcrypt';
import connection from '../database/database.js';
import signInSchema from '../schemas/signInSchema.js';

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.sendStatus(400);
  }

  const validation = signInSchema.validate({ email, password });

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

    if (compareSync(password, result.rows[0].password)) {
      return res.sendStatus(200);
    }

    return res.sendStatus(401);
  } catch {
    return res.sendStatus(500);
  }
};

export default signIn;
