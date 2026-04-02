import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';

const NAMESPACE = 'Auth';

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Validating token');

    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            if (error) {
                return res.status(404).json({
                    message: error.message,
                    error
                });
            } else {
                // Attach decoded token to res.locals for use in subsequent middleware or route handlers
                res.locals.jwt = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};

const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    const decoded = res.locals.jwt;
    
    if (decoded && decoded.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            message: 'Access denied: Admins only'
        });
    }
};

export { extractJWT, checkAdmin }; 
