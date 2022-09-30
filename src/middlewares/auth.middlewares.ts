import { Request, Response, NextFunction } from 'express';

export const authLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    if (req.isAuthenticated()) return next();
    return res.sendStatus(400);
};
