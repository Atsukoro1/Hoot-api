import * as Joi from 'joi';
import { UserSettingsResponse } from './user.settings.interfaces';

export const userSettingsSchema = Joi.object({
  newUsername: Joi.string().min(3).max(63).alphanum().optional(),
  newPassword: Joi.string().min(8).optional(),
  newEmail: Joi.string().email().max(255).email().optional(),
  newBio: Joi.string().min(3).max(200).optional(),
  password: Joi.string().required().min(8),
}).options({ stripUnknown: true });

export const validate = function (body, validator) {
  const validation = validator.validate(body);
  if (validation.error)
    return new UserSettingsResponse(false, validation.error.details[0].message);
  return undefined;
};
