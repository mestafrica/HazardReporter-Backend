import Joi from "joi";

export const registerValidator = Joi.object({
  userName: Joi.string().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9+\s\-()]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a valid phone number",
    }),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
});

export const loginValidator = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required(),
});

export const forgotPasswordValidator = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordValidator = Joi.object({
  resetToken: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

export const createUserValidator = Joi.object({
  userName: Joi.string().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9+\s\-()]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a valid phone number",
    }),
  email: Joi.string().email().optional(),
  password: Joi.string().required(),
  role: Joi.string().required().valid("admin", "user"),
});

export const updateUserValidator = Joi.object({
  userName: Joi.string(),
  phoneNumber: Joi.string().pattern(/^[0-9+\s\-()]{7,15}$/),
  email: Joi.string().email().optional(),
  role: Joi.string().valid("admin", "user"),
});

export const adminSignupValidator = Joi.object({
  userName: Joi.string().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9+\s\-()]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a valid phone number",
    }),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
});

export const adminSigninValidator = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required(),
});
