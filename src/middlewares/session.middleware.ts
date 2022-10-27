import { Request, Response, NextFunction } from 'express';
import MongoStore from 'connect-mongo';
import session from 'express-session';

const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    return session({
        secret: process.env.SECRET as string,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URL
        }),
        cookie: {
            httpOnly: true,
            // httpOnly: false,
            // secure: false,
            secure: process.env.NODE_ENV === 'development' ? false : true, // jika menggunakan http false jika https true
            maxAge: 60 * 60 * 1000
        }
    })(req, res, next);
};

export default sessionMiddleware;
