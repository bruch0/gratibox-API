import connection from '../database/database.js';

const getUserSubscription = async (req, res) => {
  const { sessionId, newToken } = req;

  try {
    const userSession = await connection.query(
      'SELECT * FROM sessions WHERE id = $1',
      [sessionId]
    );
    const userId = userSession.rows[0].user_id;

    const user = await connection.query('SELECT * FROM users WHERE id = $1', [
      userId,
    ]);
    const userInfo = user.rows[0];
    const subscriptionId = user.rows[0].subscription_id;

    if (!subscriptionId) {
      return res.sendStatus(401);
    }

    const subscription = await connection.query(
      'SELECT * FROM subscriptions WHERE id = $1',
      [subscriptionId]
    );
    const subscriptionName = subscription.rows[0].name;

    const items = await connection.query(
      'SELECT requested_items.*, items.name FROM requested_items JOIN items ON requested_items.item_id = items.id WHERE requested_items.user_id = $1',
      [userId]
    );
    const wantedItems = [];
    items.rows.map((item) => {
      wantedItems.push(item.name);
    });

    const deliverys = await connection.query(
      'SELECT * FROM deliverys WHERE user_id = $1 ORDER BY id DESC LIMIT 3',
      [userId]
    );
    const dates = [];
    for (let i = 2; i >= 0; i -= 1) {
      dates.push(deliverys.rows[i].scheduled_date);
    }

    return res.send({
      subscriptionName,
      subscriptionDate: userInfo.subscription_date,
      wantedItems,
      dates,
      newToken,
    });
  } catch {
    return res.sendStatus(500);
  }
};

export default getUserSubscription;
