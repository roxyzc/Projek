import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Logger } from '../library/logging.library';
export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ success: false, message: 'Invalid token' });
        const token = authHeader?.split(' ')[1];
        jwt.verify(token as string, process.env.ACCESSTOKEN_SECRET as string, async (err: any, decoded: any): Promise<any> => {
            if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
            req.User = decoded;
            next();
        });
    } catch (error: any) {
        Logger.error(error);
        throw new Error(error);
    }
};

export const verifyTokenAndAuthorization = (req: Request, res: Response, next: NextFunction) => {
    try {
        verifyToken(req, res, () => {
            if (req.User.role == 'admin' || req.User.id === req.params.id) return next();
            return res.status(403).json({ success: false, message: 'You are not alowed to do that' });
        });
    } catch (error: any) {
        Logger.error(error);
        throw new Error(error);
    }
};

export const verifyTokenAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        verifyToken(req, res, () => {
            if (req.User.role == 'admin') return next();
            return res.status(403).json({ success: false, message: 'You are not alowed to do that' });
        });
    } catch (error: any) {
        Logger.error(error);
        throw new Error(error);
    }
};

export const checkExpired = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ success: false, message: 'Invalid token' });
        const token = authHeader?.split(' ')[1];
        jwt.verify(token as string, process.env.ACCESSTOKEN_SECRET as string, async (err: any, _decoded: any): Promise<any> => {
            if (!err) return res.status(403).json({ success: false, message: 'Your token has not expired' });
            req.token = token;
            next();
        });
    } catch (error: any) {
        Logger.error(error);
        throw new Error(error);
    }
};
