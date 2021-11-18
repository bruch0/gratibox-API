import joi from 'joi';

const feedbackSchema = joi.object({
  feedbackId: joi.number().required(),
  boxId: joi.number().required(),
  comment: joi.string().min(8),
});

export default feedbackSchema;
