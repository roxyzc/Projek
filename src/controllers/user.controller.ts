import { Request, Response } from 'express';
import { Logger } from '../library/logging.library';
import UserModel from '../models/user.model';
import { slug } from '../library/slug.library';
// import moment from 'moment';

interface IUser {
    findAllUser(req: Request, res: Response): any;
    deleteUser(req: Request, res: Response): any;
    updateUser(req: Request, res: Response): any;
}

class User implements IUser {
    public async findAllUser(req: Request, res: Response) {
        try {
            const users = req.query.new
                ? await UserModel.find({ role: 'guru' }, { 'data.username': 1, 'data.email': 1, 'data.kelas': 1, role: 1 }).sort({ createdAt: -1 }).limit(Number(req.query.new))
                : await UserModel.find({ role: 'guru' }, { 'data.username': 1, 'data.email': 1, 'data.kelas': 1, role: 1 });
            res.status(200).json({ success: true, users });
        } catch (error: any) {
            Logger.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
    public async deleteUser(req: Request, res: Response): Promise<any> {
        try {
            const user = await UserModel.findByIdAndDelete(req.params.id);
            if (!user) return res.status(400).json({ success: false, message: 'Bad request' });
            if (req.User.id === req.params.id) {
                return req.logOut((_error) => {
                    req.session.destroy((error) => {
                        if (error) throw new Error(error);
                        res.status(204).end();
                    });
                });
            }
            return res.status(200).json({ success: true, message: 'delete account successfully' });
        } catch (error: any) {
            Logger.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<any> {
        try {
            const { username, password, kelas } = req.body;
            const user: any = await UserModel.findOne({ $and: [{ _id: req.params.id }, { username }] });
            if (!user || user.role === 'admin') return res.status(400).json({ success: false, message: "User not found or account can't be deleted" });
            if (password !== undefined) {
                const valid = await user.comparePassword(password);
                if (valid) throw new Error('Your password is the same as your old password');
                user.data.password = password;
            }
            if (username !== undefined) user.data.username = slug(username);
            if (kelas !== undefined) user.data.kelas = kelas;
            user.save();
            return res.status(200).json({ success: true, message: 'Update user successfully' });
        } catch (error: any) {
            Logger.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default User;
