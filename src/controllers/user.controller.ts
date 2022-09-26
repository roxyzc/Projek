import { Request, Response } from 'express';
import { Logger } from '../library/logging.library';

interface IUser {
    check(req: Request, res: Response): any;
}

class User implements IUser {
    public async check(_req: Request, res: Response) {
        try {
            res.sendStatus(200);
        } catch (error) {
            Logger.error(error);
            res.status(500).json({ success: false, error });
        }
    }
}

export default User;
