import dayjs from 'dayjs';
import connection from '../database/database.js';
import subscribeSchema from '../schemas/subscribeSchema.js';

const subscribeUser = async (req, res) => {
  const { plan, deliveryDate, itemsWanted, zipcode, number } = req.body;
  const { sessionId } = req;

  if (!plan || !deliveryDate || !itemsWanted || !zipcode || !number) {
    return res.sendStatus(400);
  }

  const validation = subscribeSchema.validate(req.body);

  if (validation.error) {
    return res.sendStatus(400);
  }

  try {
    const user = await connection.query(
      'SELECT * FROM sessions WHERE id = $1',
      [sessionId]
    );
    const userId = user.rows[0].user_id;

    const subscription = await connection.query(
      'SELECT * FROM subscriptions WHERE name = $1',
      [plan]
    );
    const subscriptionId = subscription.rows[0].id;

    const getDate = await connection.query(
      'SELECT * FROM delivery_dates WHERE date = $1',
      [deliveryDate]
    );
    const dateId = getDate.rows[0].id;

    await connection.query(
      'UPDATE users SET subscription_id = $1, zipcode = $2, number = $3, subscription_date = $4  WHERE id = $5',
      [subscriptionId, zipcode, number, dayjs().format('DD/MM/YYYY'), userId]
    );

    itemsWanted.forEach(async (item) => {
      const teste = await connection.query('SELECT * FROM users');
      await connection.query(
        'INSERT INTO requested_items (user_id, item_id) VALUES ($1, $2)',
        [userId, item]
      );
    });

    const milisecondsPerDay = 86400000;
    const milisecondsPerWeek = 604800000;
    const milisecondsPerMonth = 2541600000;

    if (plan === 'weekly') {
      let addDate = milisecondsPerWeek;
      let date;
      let deliveryScheduledCount = 0;
      if (deliveryDate === 'monday') {
        date = 1;
      } else if (deliveryDate === 'wednesday') {
        date = 3;
      } else {
        date = 5;
      }

      while (deliveryScheduledCount < 3) {
        if (dayjs(dayjs() + addDate).day() !== date) {
          addDate += milisecondsPerDay;
        } else {
          async () => {
            await connection.query(
              'INSERT INTO deliverys (user_id, scheduled_date, date_id) VALUES ($1, $2, $3',
              [userId, dayjs(dayjs() + addDate).format('DD/MM/YYYY'), dateId]
            );
          };
          deliveryScheduledCount += 1;
          addDate += milisecondsPerWeek;
        }
      }
    } else {
      let addDate = milisecondsPerWeek;
      let deliveryScheduledCount = 0;

      while (deliveryScheduledCount < 3) {
        if (dayjs(dayjs() + addDate).format('DD') !== deliveryDate) {
          addDate += milisecondsPerDay;
        } else {
          if (
            dayjs(dayjs() + addDate).day() === 0 ||
            dayjs(dayjs() + addDate).day() === 6
          ) {
            addDate += milisecondsPerDay;
          }
          async () => {
            await connection.query(
              'INSERT INTO deliverys (user_id, scheduled_date, date_id) VALUES ($1, $2, $3',
              [userId, dayjs(dayjs() + addDate).format('DD/MM/YYYY'), dateId]
            );
          };
          deliveryScheduledCount += 1;
          addDate += milisecondsPerMonth;
        }
      }
    }

    return res.sendStatus(201);
  } catch {
    return res.sendStatus(500);
  }
};

export default subscribeUser;
