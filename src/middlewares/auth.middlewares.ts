import { Request, Response, NextFunction } from 'express';

export const authLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) return next();
    return res.sendStatus(400);
};

// export const authLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//     console.log(req.session.passport?.user);
//     return res.sendStatus(400);
// };
