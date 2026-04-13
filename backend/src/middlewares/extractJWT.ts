import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import {IUser} from '../interfaces/user';

const NAMESPACE = 'Auth';

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
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
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};

const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    const decoded = req.user;
    
    if (decoded && decoded.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            message: 'Access denied: Admins only'
        });
    }
};

export { extractJWT, checkAdmin }; 
