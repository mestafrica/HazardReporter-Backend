import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { roles } from '../config/roles';

const NAMESPACE = 'Auth';

const checkAuth = (req: Request, res: Response, next: NextFunction): Response | void => {
    logging.info(NAMESPACE, 'Validating token');

    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            if (error) {
                console.error('JWT verification error:', error);
                return res.status(401).json({
                    message: error.message,
                    error
                });
            } else {
                // Log the decoded JWT
                console.log('Decoded JWT:', decoded);
                // Attach decoded token to res.locals for use in subsequent middleware or route handlers
                res.locals.jwt = decoded as jwt.JwtPayload;
                next();
            }
        });

    } else {
        console.error('No token provided');
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};



const hasPermission = (permission: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            // Ensure res.locals.jwt is correctly populated
            const decodedJwt = res.locals.jwt as jwt.JwtPayload;
            const userId = decodedJwt.id;
            // // Log the JWT payload
            if (!userId) {
                return res.status(401).json('Unauthorized: No user ID provided.');
            }
            // Find user by id
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json('User not found.');
            }
            // Find user role with permissions
            const userRole = roles.find(element => element.role === user.role);
            // // Log the user role
            // console.log('User role:', userRole);
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