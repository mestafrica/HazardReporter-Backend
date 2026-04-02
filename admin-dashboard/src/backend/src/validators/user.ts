import Joi from "joi";

export const registerValidator = Joi.object({
    userName: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

export const loginValidator = Joi.object({
    userName: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().required(),
});

export const forgotPasswordValidator = Joi.object({
    email: Joi.string().email().required(),
});

export const resetPasswordValidator = Joi.object({
    resetToken: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

export const createUserValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required().valid('admin', 'user'),
});

export const updateUserValidator = Joi.object({
    userName: Joi.string(),
    role: Joi.string().valid('admin', 'user'),
});