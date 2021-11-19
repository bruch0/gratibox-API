import dayjs from 'dayjs';
import connection from '../database/database.js';
import subscribeSchema from '../schemas/subscribeSchema.js';
import scheduleDelivery from '../utils/scheduleDelivery.js';

const subscribeUser = async (req, res) => {
  const { plan, deliveryDate, itemsWanted, zipcode, number } = req.body;
  const { sessionId, newToken } = req;

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

    const alreadySubcribed = await connection.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (alreadySubcribed.rows[0].subscription_date) {
      return res.sendStatus(409);
    }

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
      await connection.query(
        'INSERT INTO requested_items (user_id, item_id) VALUES ($1, $2)',
        [userId, item]
      );
    });

    scheduleDelivery(plan, deliveryDate, userId, dateId, false, 3);

    return res.status(201).send(newToken);
  } catch {
    return res.sendStatus(500);
  }
};

const changeSubscription = async (req, res) => {
  const { plan, deliveryDate, itemsWanted, zipcode, number } = req.body;
  const { sessionId } = req;

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

    const alreadySubcribed = await connection.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (!alreadySubcribed.rows[0].subscription_date) {
      return res.sendStatus(400);
    }

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

    await connection.query('DELETE FROM requested_items WHERE user_id = $1', [
      userId,
    ]);

    itemsWanted.forEach(async (item) => {
      await connection.query(
        'INSERT INTO requested_items (user_id, item_id) VALUES ($1, $2)',
        [userId, item]
      );
    });

    scheduleDelivery(plan, deliveryDate, userId, dateId, false, 3);

    return res.sendStatus(200);
  } catch {
    return res.sendStatus(500);
  }
};

export { subscribeUser, changeSubscription };
