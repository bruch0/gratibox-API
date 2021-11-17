import joi from 'joi';

const subscribeSchema = joi.object({
  plan: joi.string().required().valid('monthly', 'weekly'),
  deliveryDate: joi.string().required().valid('01', '10', '20'),
  itemsWanted: joi
    .array()
    .items(joi.number().min(1).max(3))
    .required()
    .min(1)
    .max(3),
  number: joi.number().required(),
  zipcode: joi
    .string()
    .required()
    .min(8)
    .pattern(/[0-9]{8}/),
});

export default subscribeSchema;
