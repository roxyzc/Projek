import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    return session({
        secret: process.env.SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            maxAge: 36000000
        }
    })(req, res, next);
};

export default sessionMiddleware;
