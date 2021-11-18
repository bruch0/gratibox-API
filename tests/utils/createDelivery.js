import faker from 'faker';
import dayjs from 'dayjs';
import connection from '../../src/database/database.js';
import createToken from '../factories/tokenFactory';

const createDelivery = async () => {
  const { token } = await createToken();

  const user = await connection.query(
    'SELECT * FROM sessions WHERE token = $1',
    [token]
  );
  const userId = user.rows[0].user_id;

  const box = await connection.query(
    'INSERT INTO deliverys (user_id, scheduled_date, date_id) VALUES ($1, $2, $3) RETURNING id',
    [
      userId,
      dayjs().format('DD/MM/YYYY'),
      faker.random.arrayElement(['1', '2', '3', '4', '5', '6']),
    ]
  );

  const boxId = box.rows[0].id;

  return { boxId: Number(boxId), token };
};

export default createDelivery;
