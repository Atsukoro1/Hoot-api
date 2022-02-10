import * as Joi from "joi";
import { isValidObjectId } from "mongoose";
import { HootResponse } from "./hoots.interfaces";

export const createSchema = Joi.object({
    author: Joi.string().custom((value, helper) => {
        if (!isValidObjectId(value)) { return helper.message({ custom: "Id is not valid!" }); } else { return true; }
    }).required(),
    textContent: Joi.string().min(1).max(250).required(),
    isReplyTo: Joi.string().custom((value, helper) => {
        if (!isValidObjectId(value)) { return helper.message({ custom: "Id is not valid!" }); } else { return true; }
    }),
    hashtags: Joi.array().items(Joi.string())
}).options({ stripUnknown: true });

export const getSchema = Joi.object({
    id: Joi.string().custom((value, helper) => {
        if (!isValidObjectId(value)) { return helper.message({ custom: "Id is not valid!" }); } else { return true; }
    }).required()
}).options({ stripUnknown: true });

export const deleteSchema = Joi.object({
    id: Joi.string().custom((value, helper) => {
        if (!isValidObjectId(value)) { return helper.message({ custom: "Id is not valid!" }); } else { return true; }
    }).required()
}).options({ stripUnknown: true });

export const editSchema = Joi.object({
    textContent: Joi.string().min(1).max(250),
    hashtags: Joi.array().items(Joi.string()),
    id: Joi.string().custom((value, helper) => {
        if (!isValidObjectId(value)) { return helper.message({ custom: "Id is not valid!" }); } else { return true; }
    }).required()
}).options({ stripUnknown: true });

export const reactSchema = Joi.object({
    id: Joi.string().custom((value, helper) => {
        if (!isValidObjectId(value)) { return helper.message({ custom: "Id is not valid!" }); } else { return true; }
    }).required()
}).options({ stripUnknown: true });

export const deleteReactionSchema = Joi.object({
    id: Joi.string().custom((value, helper) => {
        if (!isValidObjectId(value)) { return helper.message({ custom: "Id is not valid!" }); } else { return true; }
    }).required()
}).options({ stripUnknown: true });

export const searchSchema = Joi.object({
    query: Joi.string().min(1).max(256).required(),
    page: Joi.number().min(1).optional()
}).options({ stripUnknown: true });


export const validate = function(body, validator) {
    const validation = validator.validate(body);
    if (validation.error) return new HootResponse(false, validation.error.details[0].message, undefined);
    return undefined;
}