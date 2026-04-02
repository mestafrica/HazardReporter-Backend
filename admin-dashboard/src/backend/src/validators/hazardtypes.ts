import joi from "joi";


export const hazardtypeSchema = joi.object({
    name: joi.string().required()
})


