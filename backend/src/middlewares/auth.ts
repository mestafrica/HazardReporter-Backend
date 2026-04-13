import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { roles } from '../config/roles';
import {IUser} from '../interfaces/user';


const NAMESPACE = 'Auth';

const checkAuth = (req: Request, res: Response, next: NextFunction): Response | void => {
    logging.info(NAMESPACE, 'Validating token');

    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, config.server.token.secret, async (error, decoded) => {
            if (error) {
                console.error('JWT verification error:', error);
                return res.status(401).json({
                    message: error.message,
                    error
                });
            } 
            
        const payload = decoded as jwt.JwtPayload;

        // Fetch the full Mongoose user document and attach it
            const user = await User.findById(payload.id) as IUser | null;
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};



const hasPermission = (permission: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            // Ensure req.user is correctly populated
            const user = req.user;

            if (!user) {
                return res.status(401).json('Unauthorized: No user found.');
            }

            // Find user role with permissions
            const userRole = roles.find(element => element.role === user.role);
            // // Log the user role

            // Use role to check if the user has permission
            if (userRole && userRole.permissions.includes(permission)) {
                return next();
            } else {
                return res.status(403).json('Not authorized!');
            }
        } catch (error) {
            next(error);
        }
    }
}

export { checkAuth, hasPermission } 