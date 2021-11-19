import dayjs from 'dayjs';
import connection from '../database/database.js';
import scheduleDelivery from '../utils/scheduleDelivery.js';

const updateBoxes = async (req, res) => {
  const { sessionId, newToken } = req;
  try {
    const userSession = await connection.query(
      'SELECT * FROM sessions WHERE id = $1',
      [sessionId]
    );
    const userId = userSession.rows[0].user_id;

    const deliverys = await connection.query(
      `SELECT * FROM deliverys WHERE user_id = $1 ORDER BY id DESC LIMIT 3`,
      [userId]
    );
    const dateId = deliverys.rows[0].date_id;

    const dates = await connection.query(
      'SELECT * FROM delivery_dates WHERE id = $1',
      [dateId]
    );
    const chosenDate = dates.rows[0].date;
    let updatesNeeded = 0;

    deliverys.rows.forEach((box) => {
      const aux = box.scheduled_date.split('/');
      const fixedDate = `${aux[1]}/${aux[0]}/${aux[2]}`;
      if (dayjs() > dayjs(fixedDate)) {
        updatesNeeded += 1;
      }
    });

    if (updatesNeeded) {
      scheduleDelivery(
        dateId <= 3 ? 'monthly' : 'weekly',
        chosenDate,
        userId,
        dateId,
        true,
        updatesNeeded
      );
    }

    return res.send({
      newToken,
    });
  } catch {
    return res.sendStatus(500);
  }
};

export default updateBoxes;
