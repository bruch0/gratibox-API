import { hashSync } from 'bcrypt';
import connection from '../database/database.js';
import signUpSchema from '../schemas/signUpSchema.js';

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.sendStatus(400);
  }

  const validation = signUpSchema.validate(req.body);

  if (validation.error) {
    return res.sendStatus(400);
  }

  const result = await connection.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (result.rowCount !== 0) {
    return res.sendStatus(409);
  }

  const hash = hashSync(password, 10);
  await connection.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
    [name, email, hash]
  );
  return res.sendStatus(201);
};

export default signUp;
