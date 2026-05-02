import Joi from "joi";

export const hazardtypeSchema = Joi.object({
  name: Joi.string().required()
});
