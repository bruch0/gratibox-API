import joi from 'joi';

const signUpSchema = joi.object({
  name: joi.string().required().min(3),
  email: joi.string().required().email().min(5),
  password: joi.string().required().min(8),
});

export default signUpSchema;
