import * as Joi from "joi";
import { isValidObjectId } from "mongoose";
import { MeResponse } from "./@me.interfaces";

export const bookmarkValidator = Joi.object({
    id: Joi.string().custom((value, helper) => {
        if (!isValidObjectId(value)) { return helper.message({ custom: "Id is not valid!" }); } else { return true; }
    }).required()
}).options({ stripUnknown: true });

export const blockedValidator = Joi.object({
    page: Joi.number().optional().min(1)
}).options({ stripUnknown: true });


export const validate = function(body, validator) {
    const validation = validator.validate(body);
    if (validation.error) return new MeResponse(false, validation.error.details[0].message, undefined);
    return undefined;
}