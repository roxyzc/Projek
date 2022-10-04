import { Request, Response } from 'express';
import { Logger } from '../library/logging.library';
import UserModel from '../models/user.model';
import { slug } from '../library/slug.library';

interface IUser {
    check(req: Request, res: Response): any;
    deleteUser(req: Request, res: Response): any;
    // updateUser(req: Request, res: Response): any;
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

    public async findUser(req: Request, res: Response): Promise<any> {
        try {
            const users = req.query.kelas ? await UserModel.find({ 'data.kelas': req.query.kelas }, { 'data.username': 1, 'data.email': 1, 'data.kelas': 1 }) : false;
            if (!users) throw new Error('your query is required');
            return res.status(200).json({ success: true, users });
        } catch (error: any) {
            Logger.error(error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    public async findAllUser(req: Request, res: Response): Promise<any> {
        try {
            const query = req.query.new;
            const users = query
                ? await UserModel.find({}, { 'data.username': 1, 'data.email': 1, 'data.kelas': 1 }).sort({ createdAt: -1 }).limit(1)
                : await UserModel.find({}, { 'data.username': 1, 'data.email': 1, 'data.kelas': 1 });
            res.status(200).json({ success: true, users });
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
    public async updateUser(req: Request, res: Response): Promise<any> {
        try {
            const { username, password, kelas } = req.body;
            const user: any = await UserModel.findById(req.params.id);
            if (!user || user.role === 'admin') return res.sendStatus(400);
            if (password !== undefined) {
                const valid = await user.comparePassword(password);
                console.log(valid);
                if (valid) throw new Error('Your password is the same as your old password');
                user.data.password = password;
                user.save();
            }
            await UserModel.findByIdAndUpdate(
                req.params.id,
                {
                    'data.username': slug(username),
                    'data.kelas': kelas
                },
                { new: true }
            );
            return res.sendStatus(200);
        } catch (error: any) {
            Logger.error(error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default User;
