import { NextFunction, Request, Response } from "express";
import IUser from "../models/user";
import bcrypt from "bcrypt";
import {
  forgotPasswordValidator,
  loginValidator,
  resetPasswordValidator,
} from "../validators/user";
import * as jwt from "jsonwebtoken";
import { ResetTokenModel } from "../models/token";
import { mailTransport } from "../utils/sendEmail";

const token = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request
    const { value, error } = loginValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }
    // Find a user with their unique identifier
    const user = await IUser.findOne({
      $or: [{ userName: value.userName }, { email: value.email }],
    });
    if (!user) {
      return res.status(401).json("User Not Found");
    }
    // Verify their password
    const correctPassword = bcrypt.compareSync(value.password, user.password);
    if (!correctPassword) {
      return res.status(401).json("Invalid Credentials");
    }
    // Create a token
    const token = jwt.sign(
      { id: user.id },
      process.env.SERVER_TOKEN_SECRET ?? "defaultSecret",
      // process.env.JWT_PRIVATE_KEY,
      { expiresIn: "72h" }
    );
    // Return response
    res.status(200).json({
      message: "User Logged In",
      accessToken: token,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request
    const { value, error } = forgotPasswordValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }
    // Find a user with provided email
    const user = await IUser.findOne({ email: value.email });
    if (!user) {
      return res.status(404).json("User Not Found");
    }
    // Generate reset token
    const resetToken = await ResetTokenModel.create({ userId: user.id });
    // Send reset email
    await mailTransport.sendMail({
      to: value.email,
      subject: "Reset Your Password",
      html: `
          <h1>Hello ${user.userName}</h1>
          <h1>Please follow the link below to reset your password.</h1>
          <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken.id}">Click Here</a>
          `,
    });
    // Return response
    res.status(200).json("Password Reset Mail Sent!");
  } catch (error) {
    next(error);
  }
};

const verifyResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find Reset Token by id
    const resetToken = await ResetTokenModel.findById(req.params.id);
    if (!resetToken) {
      return res.status(404).json("Reset Token Not Found");
    }
    // Check if token is valid
    if (
      resetToken.expired ||
      Date.now() >= new Date(resetToken.expiresAt).valueOf()
    ) {
      return res.status(409).json("Invalid Reset Token");
    }
    // Return response
    res.status(200).json("Reset Token is Valid!");
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request
    const { value, error } = resetPasswordValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }
    // Find Reset Token by id
    const resetToken = await ResetTokenModel.findById(value.resetToken);
    if (!resetToken) {
      return res.status(404).json("Reset Token Not Found");
    }
    // Check if token is valid
    if (
      resetToken.expired ||
      Date.now() >= new Date(resetToken.expiresAt).valueOf()
    ) {
      return res.status(409).json("Invalid Reset Token");
    }
    // Encrypt user password
    const hashedPassword = bcrypt.hashSync(value.password, 10);
    // Update user password
    await IUser.findByIdAndUpdate(resetToken.userId, {
      password: hashedPassword,
    });
    // Expire reset token
    await ResetTokenModel.findByIdAndUpdate(value.resetToken, {
      expired: true,
    });
    // Return response
    res.status(200).json("Password Reset Successful!");
  } catch (error) {
    next(error);
  }
};

export default { token, forgotPassword, resetPassword, verifyResetToken };
