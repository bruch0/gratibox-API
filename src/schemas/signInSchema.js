import joi from 'joi';

const signInSchema = joi.object({
  email: joi.string().required().email().min(5),
  password: joi.string().required().min(8),
});

export default signInSchema;
