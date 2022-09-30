import { Response, Request, NextFunction } from 'express';
import { Logger } from '../library/logging.library';
import { createUser } from '../services/user.service';
import passport from 'passport';

interface IAuth {
    register(req: Request, res: Response): any;
    login(req: Request, res: Response, next: NextFunction): any;
    logout(req: Request, res: Response): any;
}

class Auth implements IAuth {
    public async register(req: Request, res: Response) {
        try {
            const user = await createUser(req.body);
            res.status(200).json({ success: true, message: 'account created successfully', user });
        } catch (error: any) {
            Logger.error(error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            passport.authenticate('local', async (error, user, _info): Promise<any> => {
                if (error) return res.status(400).json({ success: false, error });
                req.login(user, (error) => {
                    if (error) throw new Error(error);
                    return res.status(200).json({ success: true, message: 'Login successfully', user });
                });
            })(req, res, next);
        } catch (error) {
            Logger.error(error);
            res.status(500).json({ success: false, error });
        }
    }
    public async logout(req: Request, res: Response) {
        try {
            req.logOut((_error) => {
                req.session.destroy((error) => {
                    if (error) throw new Error(error);
                    return res.status(204).end();
                });
            });
        } catch (error) {
            Logger.error(error);
            res.status(500).json({ success: false, error });
        }
    }
}

export default Auth;
