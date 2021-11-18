import connection from '../../src/database/database.js';

const getUserId = async (email) => {
  const result = await connection.query(
    `SELECT * FROM users 
	  WHERE email = $1`,
    [email]
  );

  return { userId: result.rows[0].id };
};

export default getUserId;
