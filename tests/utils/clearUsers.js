import connection from '../../src/database/database.js';

const clearUsers = async () => {
  await connection.query('DELETE FROM users');
};

export default clearUsers;
