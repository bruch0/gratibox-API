import connection from '../database/database.js';
import signUpSchema from '../schemas/signUpSchema.js';

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.sendStatus(400);
  }

  const validation = signUpSchema.validate({ name, email, password });

  if (validation.error) {
    return res.sendStatus(400);
  }

  try {
    await connection.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, password]
    );
    return res.sendStatus(201);
  } catch {
    return res.sendStatus(500);
  }
};

export default signUp;
