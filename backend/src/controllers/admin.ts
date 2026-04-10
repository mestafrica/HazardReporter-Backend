import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import logging from "../config/logging";
import User from "../models/user";
import HazardReport from "../models/hazardreport";
import signJWT from "../functions/signJWT";
import {
    adminSignupValidator,
    adminSigninValidator,
} from "../validators/user";

const NAMESPACE = "Admin";

const isErrorWithMessage = (error: unknown): error is { message: string } => {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as any).message === "string"
    );
};

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
            return res.status(403).json({ message: "Access denied. This login is for admins only." });
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

// ADMIN LOGOUT
const adminLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json({
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            message: "Error processing request",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

// GET ALL REPORTS
const getAllReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reports = await HazardReport.find().populate(
            "user",
            "userName phoneNumber email",
        );
        res.status(200).json({ reports, count: reports.length });
    } catch (error) {
        next(error);
    }
};

// GET ALL USERS
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


export default {
    adminSignup,
    adminSignin,
    adminLogout,
    getAllReports,
    getAllUsers,
};