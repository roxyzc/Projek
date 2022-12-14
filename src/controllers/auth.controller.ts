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
            res.status(500).json({ success: false, message: error.message });
        }
    }
    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            passport.authenticate('local', async (error, user, _info): Promise<any> => {
                if (error) return res.status(400).json({ success: false, message: error });
                req.login(user, (error) => {
                    if (error) throw new Error(error);
                    const {
                        data: { password, ...others },
                        role,
                        _id,
                        token: { ...token }
                    } = user._doc;
                    return res.status(200).json({ success: true, message: 'Login successfully', user: others, _id, role, token });
                });
            })(req, res, next);
        } catch (error) {
            Logger.error(error);
            res.status(500).json({ success: false, message: error });
        }
    }
    public async logout(req: Request, res: Response) {
        try {
            req.logOut((_error) => {
                // const user = await findUser(req.User.id);
                // console.log(user);
                // Object.assign(user, { token: { accessToken: undefined, refreshToken: undefined } }).save();
                req.session.destroy((error) => {
                    if (error) throw new Error(error);
                    // req.sessionStore.destroy(req.sessionID);
                    return res.status(204).end();
                });
            });
        } catch (error) {
            Logger.error(error);
            res.status(500).json({ success: false, message: error });
        }
    }
}

export default Auth;
