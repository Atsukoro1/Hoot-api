import * as Joi from 'joi';
import { UserAuthResponse } from './user.auth.interfaces';

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(64).required(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(8).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(8).required(),
});

export const validate = function (body, validator) {
  const validation = validator.validate(body);
  if (validation.error)
    return new UserAuthResponse(
      false,
      validation.error.details[0].message,
      undefined,
    );
  return undefined;
};
