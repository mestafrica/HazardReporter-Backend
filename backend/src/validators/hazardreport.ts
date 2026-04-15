import Joi from "joi";

export const hazardreportValidator = Joi.object({
    title: Joi.string().required(),
    hazardtype: Joi.string().required(),
    description: Joi.string().required(),
    images: Joi.array().items(Joi.string()).sparse(false).default([]),
    location: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    user: Joi.string().optional()
});