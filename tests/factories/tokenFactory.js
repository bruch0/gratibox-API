import jwt from 'jsonwebtoken';
import connection from '../../src/database/database.js';
import createUser from './userFactory.js';
import getUserId from '../utils/getUserId.js';

const createToken = async () => {
  const user = await createUser();
  const { userId } = await getUserId(user.email);
  const result = await connection.query(
    'INSERT INTO sessions (user_id) VALUES ($1) RETURNING id',
    [userId]
  );

  const jwtSecret = process.env.JWT_SECRET;
  const token = jwt.sign({ sessionId: result.rows[0].id }, jwtSecret);

  return { token };
};

export default createToken;
