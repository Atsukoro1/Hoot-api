import * as Joi from 'joi';
import { UsersResponse } from './users.interfaces';
import { isValidObjectId } from 'mongoose';

export const searchSchema = Joi.object({
  query: Joi.string().min(1).max(256).required(),
  page: Joi.number().min(1).optional(),
}).options({ stripUnknown: true });

export const getProfileSchema = Joi.object({
  id: Joi.string()
    .custom((value, helper) => {
      if (!isValidObjectId(value)) {
        return helper.message({ custom: 'Id is not valid!' });
      } else {
        return true;
      }
    })
    .required(),
  page: Joi.number().optional().min(1),
}).options({ stripUnknown: true });

export const getFollowsSchema = Joi.object({
  page: Joi.number().optional().min(1),
}).options({ stripUnknown: true });

export const validate = function (body, validator) {
  const validation = validator.validate(body);
  if (validation.error)
    return new UsersResponse(
      false,
      validation.error.details[0].message,
      undefined,
    );
  return undefined;
};
