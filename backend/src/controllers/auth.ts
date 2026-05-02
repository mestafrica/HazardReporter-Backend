import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { ResetTokenModel } from "../models/token";
import User from "../models/user";
import { mailTransport } from "../utils/sendEmail";
import {
  forgotPasswordValidator,
  loginValidator,
  resetPasswordValidator,
} from "../validators/user";

const token = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { value, error } = loginValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }

    const user = await User.findOne({
      $or: [{ userName: value.userName }, { email: value.email }],
    });
    if (!user) {
      return res.status(401).json("User Not Found");
    }

    const correctPassword = bcrypt.compareSync(value.password, user.password);
    if (!correctPassword) {
      return res.status(401).json("Invalid Credentials");
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.SERVER_TOKEN_SECRET ?? "defaultSecret",
      { expiresIn: "72h" },
    );

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
  next: NextFunction,
) => {
  try {
    const { value, error } = forgotPasswordValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }

    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(404).json("User Not Found");
    }

    const resetToken = await ResetTokenModel.create({ userId: user.id });

    await mailTransport.sendMail({
      to: value.email,
      subject: "Reset Your Password",
      html: `
                <h1>Hello ${user.userName}</h1>
                <h1>Please follow the link below to reset your password.</h1>
                <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken.id}">Click Here</a>
            `,
    });

    res.status(200).json("Password Reset Mail Sent!");
  } catch (error) {
    next(error);
  }
};

const verifyResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const resetToken = await ResetTokenModel.findById(req.params.id);
    if (!resetToken) {
      return res.status(404).json("Reset Token Not Found");
    }

    if (
      resetToken.expired ||
      Date.now() >= new Date(resetToken.expiresAt).valueOf()
    ) {
      return res.status(409).json("Invalid Reset Token");
    }

    res.status(200).json("Reset Token is Valid!");
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { value, error } = resetPasswordValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }

    const resetToken = await ResetTokenModel.findById(value.resetToken);
    if (!resetToken) {
      return res.status(404).json("Reset Token Not Found");
    }

    if (
      resetToken.expired ||
      Date.now() >= new Date(resetToken.expiresAt).valueOf()
    ) {
      return res.status(409).json("Invalid Reset Token");
    }

    const hashedPassword = bcrypt.hashSync(value.password, 10);

    await User.findByIdAndUpdate(resetToken.userId, {
      password: hashedPassword,
    });

    await ResetTokenModel.findByIdAndUpdate(value.resetToken, {
      expired: true,
    });

    res.status(200).json("Password Reset Successful!");
  } catch (error) {
    next(error);
  }
};

export default { token, forgotPassword, resetPassword, verifyResetToken };
