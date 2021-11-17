import fakerbr from 'faker-br';
import { hashSync } from 'bcrypt';
import connection from '../../src/database/database.js';

const createUser = async () => {
  const password = fakerbr.internet.password(8);
  const hash = hashSync(password, 10);
  try {
    const result = await connection.query(
      `
		  INSERT INTO
			users (name, email, password)
			VALUES ($1, $2, $3) RETURNING email`,
      [fakerbr.name.findName(), fakerbr.internet.email(), hash]
    );

    return { email: result.rows[0].email, password };
  } catch {
    return 500;
  }
};

export default createUser;
