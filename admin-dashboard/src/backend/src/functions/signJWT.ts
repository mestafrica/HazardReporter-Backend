import jwt, { sign } from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import IUser from '../interfaces/user';

const NAMESPACE = 'Auth';

const signJWT = (user: IUser, callback: (error: Error | null, token: string | null) => void): void => {
    const payload = {
        id: user._id.toString(), 
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userName: user.userName,
        role: user.role
    };

    jwt.sign(
        payload,
        config.server.token.secret,
        {
            issuer: config.server.token.issuer,
            algorithm: 'HS256',
            expiresIn: config.server.token.expireTime
        },
        (error, token) => {
            if (error) {
                logging.error(NAMESPACE, 'JWT signing error', error);
                callback(error, null);
            } else {
                callback(null, token ?? null);
            }
        }
    );
};

export default signJWT;