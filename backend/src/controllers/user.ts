import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import logging from "../config/logging";
import User from "../models/user";
import HazardReport from "../models/hazardreport";
import signJWT from "../functions/signJWT";
import {
  createUserValidator,
  loginValidator,
  registerValidator,
  updateUserValidator,
  adminSignupValidator,
  adminSigninValidator,
} from "../validators/user";

const NAMESPACE = "User";

const isErrorWithMessage = (error: unknown): error is { message: string } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as any).message === "string"
  );
};

// Function to register a user
const register = async (req: Request, res: Response, next: NextFunction) => {
  const { value, error } = registerValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  const { userName, phoneNumber, email, password, confirmPassword } = value;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if username already exists
    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(409).json({ message: "Username already exists!" });
    }

    // Check if phone number already exists
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(409).json({ message: "Phone number already in use!" });
    }

    // Check email only if provided
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ message: "Email already exists!" });
      }
    }

    const hash = bcryptjs.hashSync(password, 10);
    const avatar = req.file ? (req.file as any).path : "";

    const _user = new User({
      _id: new mongoose.Types.ObjectId(),
      userName,
      phoneNumber,
      email,
      password: hash,
      confirmPassword: hash,
      avatar,
    });

    const user = await _user.save();
    return res.status(201).json({ user });
  } catch (error) {
    logging.error(NAMESPACE, "Error saving user", error);
    const errorMessage = isErrorWithMessage(error)
      ? error.message
      : "Unknown error occurred";
    return res.status(500).json({ message: errorMessage, error });
  }
};

// Function to login user (token)
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { userName, password } = req.body;
  try {
    // Validate request
    const { value, error } = loginValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }
    const user = await User.findOne({ userName }).exec();
    if (!user) {
      return res.status(401).json({
        message: "Username not found",
      });
    }

    const isMatch = bcryptjs.compareSync(value.password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Password is incorrect",
      });
    }
    // Sign JWT using the signJWT function
    signJWT(user, (signError, token) => {
      if (signError) {
        return res.status(500).json({
          message: isErrorWithMessage(signError)
            ? signError.message
            : "Unknown error occurred",
          error: signError,
        });
      } else if (token) {
        return res.status(200).json({ token });
      }
    });
  } catch (err) {
    logging.error(NAMESPACE, "Error finding user", err);
    return res.status(500).json({
      message: isErrorWithMessage(err) ? err.message : "Unknown error occurred",
      error: err,
    });
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request
    const { value, error } = createUserValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }
    // Encrypt user password
    const hashedPassword = bcryptjs.hashSync(value.password, 10);
    const avatar = req.file ? (req.file as any).path : "";
    // Create user
    await User.create({
      ...value,
      password: hashedPassword,
      avatar,
    });
    // Send email to user
    // await mailTransport.sendMail({
    //     to: value.email,
    //     subject: "User Account Created!",
    //     text: `Dear user,\n\nA user account has been created for you with the following credentials.\n\nUsername: ${value.username}\nEmail: ${value.email}\nPassword: ${value.password}\nRole: ${value.role}\n\nThank you!`,
    // });
    // Return response
    res.status(201).json("User Created");
  } catch (error) {
    next(error);
  }
};

// Function to edit user
const editUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request
    const { value, error } = updateUserValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }
    if (req.file) {
      value.avatar = (req.file as any).path;
    }
    const user = await User.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Error processing request",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Function to delete a user
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId).exec();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Error processing request",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// get all reports function
const getAllReports = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reports = await HazardReport.find().populate(
      "user",
      "firstName lastName userName",
    );
    res.status(200).json({ reports, count: reports.length });
  } catch (error) {
    next(error);
  }
};

// Logout function
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Invalidate token (client-side logic is needed to actually remove the token)
    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Error processing request",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Function to get all users
const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find()
    .select("-password")
    .exec()
    .then((users) => {
      return res.status(200).json({
        users,
        count: users.length,
      });
    })
    .catch((error) => {
      logging.error(NAMESPACE, "Error getting users", error);
      return res.status(500).json({
        message: isErrorWithMessage(error)
          ? error.message
          : "Unknown error occurred",
        error,
      });
    });
};

// Function for an admin to create a user

// export default { register, login, createUser, logout, editUser, deleteUser, getAllUsers,getAllReports };

// ADMIN SIGNUP
const adminSignup = async (req: Request, res: Response, next: NextFunction) => {
  const { value, error } = adminSignupValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  const { userName, phoneNumber, email, password, confirmPassword } = value;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(409).json({ message: "Username already exists!" });
    }

    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(409).json({ message: "Phone number already in use!" });
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ message: "Email already exists!" });
      }
    }

    const hash = bcryptjs.hashSync(password, 10);
    const avatar = req.file ? (req.file as any).path : "";

    const _admin = new User({
      _id: new mongoose.Types.ObjectId(),
      userName,
      phoneNumber,
      email,
      password: hash,
      confirmPassword: hash,
      role: "admin",
      avatar,
    });

    const admin = await _admin.save();

    return res.status(201).json({
      message: "Admin account created successfully",
      admin: {
        id: admin._id,
        userName: admin.userName,
        phoneNumber: admin.phoneNumber,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    logging.error(NAMESPACE, "Error creating admin", error);
    const errorMessage = isErrorWithMessage(error)
      ? error.message
      : "Unknown error occurred";
    return res.status(500).json({ message: errorMessage, error });
  }
};

// ADMIN SIGNIN
const adminSignin = async (req: Request, res: Response, next: NextFunction) => {
  const { value, error } = adminSigninValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }

  const { userName, password } = value;

  try {
    const user = await User.findOne({ userName }).exec();
    if (!user) {
      return res.status(401).json({ message: "Username not found" });
    }

    // Block regular users
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. This login is for admins only." });
    }

    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    signJWT(user, (signError, token) => {
      if (signError) {
        return res.status(500).json({
          message: isErrorWithMessage(signError)
            ? signError.message
            : "Unknown error occurred",
          error: signError,
        });
      } else if (token) {
        return res.status(200).json({
          message: "Admin signed in successfully",
          token,
          admin: {
            id: user._id,
            userName: user.userName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        });
      }
    });
  } catch (err) {
    logging.error(NAMESPACE, "Error signing in admin", err);
    return res.status(500).json({
      message: isErrorWithMessage(err) ? err.message : "Unknown error occurred",
      error: err,
    });
  }
};

// ADMIN PROFILE GET
const getAdminProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = res.locals.jwt?.id;
  try {
    const user = await User.findById(userId).select("-password").exec();
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.status(200).json({ admin: user });
  } catch (err) {
    logging.error(NAMESPACE, "Error fetching admin profile", err);
    return res.status(500).json({
      message: isErrorWithMessage(err) ? err.message : "Unknown error occurred",
      error: err,
    });
  }
};

// ADMIN PROFILE UPDATE
const updateAdminProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = res.locals.jwt?.id;
  const updates = req.body;

  try {
    if (req.file) {
      updates.avatar = (req.file as any).path;
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      select: "-password",
    }).exec();

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      admin: user,
    });
  } catch (err) {
    logging.error(NAMESPACE, "Error updating admin profile", err);
    return res.status(500).json({
      message: isErrorWithMessage(err) ? err.message : "Unknown error occurred",
      error: err,
    });
  }
};

// Single clean export default.
export default {
  register,
  login,
  createUser,
  logout,
  editUser,
  deleteUser,
  getAllUsers,
  getAllReports,
  adminSignup,
  adminSignin,
  getAdminProfile,
  updateAdminProfile,
};
