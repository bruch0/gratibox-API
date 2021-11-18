import connection from '../../src/database/database.js';

const clearUsers = async () => {
  await connection.query('TRUNCATE requested_items CASCADE;');
  await connection.query('TRUNCATE sessions CASCADE;');
  await connection.query('TRUNCATE users CASCADE;');
};

export default clearUsers;
