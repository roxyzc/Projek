import { Request, Response } from 'express';
import { Logger } from '../library/logging.library';
import UserModel from '../models/user.model';

interface IUser {
    check(req: Request, res: Response): any;
    deleteUser(req: Request, res: Response): any;
    // updateUser(req: Request, res: Response): any;
}

class User implements IUser {
    public async check(req: Request, res: Response) {
        console.log(req.isAuthenticated());
        try {
            res.sendStatus(200);
        } catch (error) {
            Logger.error(error);
            res.status(500).json({ success: false, error });
        }
    }
    public async deleteUser(req: Request, res: Response): Promise<any> {
        try {
            const user = await UserModel.findByIdAndDelete(req.params.id);
            if (!user) return res.sendStatus(400);
            if (req.User.id === req.params.id) {
                return req.logOut((_error) => {
                    req.session.destroy((error) => {
                        if (error) throw new Error(error);
                        res.status(204).end();
                    });
                });
            }
            return res.sendStatus(200);
        } catch (error) {
            Logger.error(error);
            res.status(500).json({ success: false, error });
        }
    }
    // public async updateUser(req: Request, res: Response): Promise<any> {
    //     try {
    //         const { username, password, kelas } = req.body;
    //         const user = await UserModel.findByIdAndUpdate(
    //             req.params.id,
    //             {
    //                 'data.username': username,
    //                 'data.password': password,
    //                 'data.kelas': kelas
    //             },
    //             { new: true }
    //         );
    //         return res.sendStatus(200);
    //     } catch (error) {
    //         Logger.error(error);
    //         res.status(500).json({ success: false, error });
    //     }
    // }
}

export default User;
