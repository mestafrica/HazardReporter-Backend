import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import logging from '../config/logging';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import signJWT from '../functions/signJWT';
import bcrypt from "bcrypt";
import { createUserValidator, forgotPasswordValidator, loginValidator, registerValidator, updateUserValidator } from '../validators/user';

const NAMESPACE = 'User';


const isErrorWithMessage = (error: unknown): error is { message: string } => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as any).message === 'string'
    );
};


// Function to register a user
const register = async (req: Request, res: Response, next: NextFunction) => {
       // Validate request
       const { value, error } = registerValidator.validate(req.body);
       if (error) {
           return res.status(422).json(error);
       }
    const { firstName, lastName, email, userName, password, confirmPassword } = req.body;
    // Check for all required fields
    if (!firstName || !lastName || !email || !userName || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    try {
        // check if user does not exist
        const userEmail = await User.findOne({email: value.email});
        if (userEmail) {
            return res.status(409).json({ message:'Email already exists!'});
        }
        // Hash the password
        const hash = await bcryptjs.hashSync(password, 10);

        // Create new user
        const _user = new User({
            _id: new mongoose.Types.ObjectId(),
            firstName,
            lastName,
            email,
            userName,
            password: hash,
            confirmPassword: hash
        });

        // Save the user
        const user = await _user.save();

        return res.status(201).json({ user });
    } catch (error) {
        logging.error(NAMESPACE, 'Error saving user', error);
        const errorMessage = isErrorWithMessage(error) ? error.message : 'Unknown error occurred';
        return res.status(500).json({
            message: errorMessage,
            error
        });
    }
};


// Function to login (token)
const login = async (req: Request, res: Response, next: NextFunction) => {
    const { userName, password } = req.body;
    try {
          // Validate request
          const { value, error } = loginValidator.validate(req.body);
          if (error) {
              return res.status(422).json(error);
          }
        const user = await User.findOne({ userName }).exec();
        console.log("Login Attempt:", userName, "Found User:", !!user);
        
        if (!user) {
            return res.status(401).json({ message: 'Username not found' });
        }

        const isMatch = bcryptjs.compareSync(value.password, user.password);
        console.log("Password Match:", isMatch, "Provided:", value.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Password is incorrect' });
        }
        
        // Sign JWT using the signJWT function
        signJWT(user, (signError, token) => {
            console.log("Sign JWT Result:", !!token, signError);
                        if (signError) {
                            return res.status(500).json({
                                message: isErrorWithMessage(signError) ? signError.message : 'Unknown error occurred',
                                error: signError
                            });
                        } else if (token) {
                            return res.status(200).json({ token });
                        }
                    });
    } catch(err) {
            logging.error(NAMESPACE, 'Error finding user', err);
            return res.status(500).json({
                message: isErrorWithMessage(err) ? err.message : 'Unknown error occurred',
                error: err
        
            });
        };
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate request
        const { value, error } = createUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Encrypt user password
        const hashedPassword = bcryptjs.hashSync(value.password, 10);
        // Create user
        await User.create({
            ...value,
            password: hashedPassword
        });
        // Send email to user
        // await mailTransport.sendMail({
        //     to: value.email,
        //     subject: "User Account Created!",
        //     text: `Dear user,\n\nA user account has been created for you with the following credentials.\n\nUsername: ${value.username}\nEmail: ${value.email}\nPassword: ${value.password}\nRole: ${value.role}\n\nThank you!`,
        // });
        // Return response
        res.status(201).json('User Created');
    } catch (error) {
        next(error);
    }
}

// Function to edit user
const editUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
            // Validate request
            const { value, error } = updateUserValidator.validate(req.body);
            if (error) {
                return res.status(422).json(error);
            }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            value,
            { new: true }
        );
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        return res.status(200).json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            message: 'Error processing request',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};



// Function to delete a user
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const  userId  = req.params.id;

    try {
        const user = await User.findByIdAndDelete(userId).exec();

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        return res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            message: 'Error processing request',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

// get all reports function
const getAllReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reports = await Report; 
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
            message: 'User logged out successfully'
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            message: 'Error processing request',
            error: error instanceof Error ? error.message : String(error)
            });
    }
};


// Function to get all users
const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select('-password')
        .exec()
        .then((users) => {
            return res.status(200).json({
                users,
                count: users.length
            });
        })
        .catch((error) => {
            logging.error(NAMESPACE, 'Error getting users', error);
            return res.status(500).json({
                message: isErrorWithMessage(error) ? error.message : 'Unknown error occurred',
                error
            });
        });
};




// Function for an admin to create a user


export default { register, login, createUser, logout, editUser, deleteUser, getAllUsers,getAllReports };