import dayjs from 'dayjs';
import connection from '../database/database.js';

const scheduleDelivery = (
  plan,
  deliveryDate,
  userId,
  dateId,
  updatingBoxes,
  scheduleTimes
) => {
  const milisecondsPerDay = 86400000;
  const milisecondsPerWeek = 604800000;
  const milisecondsPerMonth = 2541600000;
  let scheduledDeliverysCount = 0;
  let addDate = updatingBoxes ? 0 : milisecondsPerWeek;

  if (plan === 'weekly') {
    let date;
    if (deliveryDate === 'monday') {
      date = 1;
    } else if (deliveryDate === 'wednesday') {
      date = 3;
    } else {
      date = 5;
    }

    while (scheduledDeliverysCount < scheduleTimes) {
      if (dayjs(dayjs() + addDate).day() !== date) {
        addDate += milisecondsPerDay;
      } else {
        connection.query(
          'INSERT INTO deliverys (user_id, scheduled_date, date_id) VALUES ($1, $2, $3)',
          [userId, dayjs(dayjs() + addDate).format('DD/MM/YYYY'), dateId]
        );
        scheduledDeliverysCount += 1;
        addDate += milisecondsPerWeek;
      }
    }
  } else {
    while (scheduledDeliverysCount < scheduleTimes) {
      if (dayjs(dayjs() + addDate).format('DD') !== deliveryDate) {
        addDate += milisecondsPerDay;
      } else {
        let skippedWeekends = 0;
        while (
          dayjs(dayjs() + addDate).day() === 0 ||
          dayjs(dayjs() + addDate).day() === 6
        ) {
          addDate += milisecondsPerDay;
          skippedWeekends += 1;
        }

        connection.query(
          'INSERT INTO deliverys (user_id, scheduled_date, date_id) VALUES ($1, $2, $3)',
          [userId, dayjs(dayjs() + addDate).format('DD/MM/YYYY'), dateId]
        );
        scheduledDeliverysCount += 1;
        addDate += milisecondsPerMonth - skippedWeekends * milisecondsPerDay;
      }
    }
  }
};

export default scheduleDelivery;
