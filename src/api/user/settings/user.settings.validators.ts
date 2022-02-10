import * as Joi from 'joi';
import { UserSettingsResponse } from './user.settings.interfaces';

export const userSettingsSchema = Joi.object({
  username: Joi.string().min(3).max(63).alphanum(),
  newPassword: Joi.string().min(8),
  newEmail: Joi.string().email().max(255).email(),
  newBio: Joi.string().min(3).max(200),
  password: Joi.string().required().min(8),
}).options({ stripUnknown: true });

export const validate = function (body, validator) {
  const validation = validator.validate(body);
  if (validation.error)
    return new UserSettingsResponse(false, validation.error.details[0].message);
  return undefined;
};
