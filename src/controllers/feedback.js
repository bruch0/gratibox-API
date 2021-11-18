import connection from '../database/database.js';
import feedbackSchema from '../schemas/feedbackSchema.js';

const registerFeedback = async (req, res) => {
  const { boxId, feedbackId, comment } = req.body;
  const { sessionId } = req;

  if (!feedbackId || !boxId || (feedbackId === 1 && comment)) {
    return res.sendStatus(400);
  }

  const validation = feedbackSchema.validate(req.body);

  if (validation.error) {
    return res.sendStatus(400);
  }

  try {
    const user = await connection.query(
      'SELECT * FROM sessions WHERE id = $1',
      [sessionId]
    );
    const userId = user.rows[0].user_id;

    const boxes = await connection.query(
      'SELECT * FROM deliverys WHERE id = $1',
      [boxId]
    );
    const boxUser = boxes.rows[0].user_id;
    const notRatedYet = boxes.rows[0].rating_id === null;

    if (userId !== boxUser || !notRatedYet) {
      return res.sendStatus(403);
    }

    await connection.query(
      'UPDATE deliverys SET rating_id = $1, rating_comment = $2 WHERE id = $3',
      [feedbackId, comment, boxId]
    );

    return res.sendStatus(200);
  } catch {
    return res.sendStatus(500);
  }
};

export default registerFeedback;
