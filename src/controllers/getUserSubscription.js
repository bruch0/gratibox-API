import connection from '../database/database.js';

const getUserSubscription = async (req, res) => {
  const { sessionId } = req;

  try {
    const userSession = await connection.query(
      'SELECT * FROM sessions WHERE id = $1',
      [sessionId]
    );
    const userId = userSession.rows[0].user_id;

    const user = await connection.query('SELECT * FROM users WHERE id = $1', [
      userId,
    ]);

    const subscriptionId = user.rows[0].subscription_id;

    if (!subscriptionId) {
      return res.send({ subscriptionId });
    }

    const subscription = await connection.query(
      'SELECT * FROM subscriptions WHERE id = $1',
      [subscriptionId]
    );
    const subscriptionName = subscription.rows[0].name;

    return res.send({ subscriptionName });
  } catch {
    return res.sendStatus(500);
  }
};

export default getUserSubscription;
