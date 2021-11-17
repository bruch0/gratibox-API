import fakerbr from 'faker-br';
import connection from '../../src/database/database.js';

const createUser = async () => {
  await connection.query(
    `
    INSERT INTO
      users (name)
      VALUES = ($1) RETURNING id`,
    [fakerbr.name.findName()]
  );
};

export default createUser;
