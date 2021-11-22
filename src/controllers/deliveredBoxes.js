import connection from '../database/database.js';

const deliveredBoxes = async (req, res) => {
  const { sessionId, newToken } = req;

  try {
    const userSession = await connection.query(
      'SELECT * FROM sessions WHERE id = $1',
      [sessionId]
    );
    const userId = userSession.rows[0].user_id;

    const deliverys = await connection.query(
      `SELECT * FROM deliverys WHERE user_id = $1 AND delivered = 'yes' AND rating_id IS NULL ORDER BY id DESC`,
      [userId]
    );

    const dates = [];

    deliverys.rows.forEach((box) => {
      dates.push({
        date: box.scheduled_date,
        id: box.id,
      });
    });

    return res.send({
      dates,
      newToken,
    });
  } catch {
    return res.sendStatus(500);
  }
};

export default deliveredBoxes;
