import IUser from "interfaces/user"; 

declare module 'express-serve-static-core' {
    interface Request {
        user?: IUser;
    }
}