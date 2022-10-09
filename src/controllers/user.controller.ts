import { Request, Response } from 'express';
import { Logger } from '../library/logging.library';
import UserModel from '../models/user.model';
import SiswaModel from '../models/siswa.model';
import { slug } from '../library/slug.library';
import { createViolationSiswa } from '../services/siswa.service';

interface IUser {
    check(req: Request, res: Response): any;
    findUser(req: Request, res: Response): any;
    findAllUser(req: Request, res: Response): any;
    deleteUser(req: Request, res: Response): any;
    deleteUser(req: Request, res: Response): any;
    updateUser(req: Request, res: Response): any;
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

    public async createViolationSiswa(req: Request, res: Response) {
        try {
            const user = await createViolationSiswa(req.body);
            res.status(200).json({ success: true, message: 'succeeded in violating the student', user });
        } catch (error: any) {
            Logger.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    public async findUser(req: Request, res: Response) {
        try {
            const user: any = await UserModel.findById(req.session.passport?.user);
            if (!user) throw new Error('User not found');
            const users = user.data.kelas
                ? await SiswaModel.find({ 'data.kelas': user.data.kelas }, { 'data.username': 1, 'data.kelas': 1, 'data.violation': 1, 'data.amount': 1 }).sort({ updatedAt: -1 })
                : false;
            if (!users) throw new Error("you can't access this");
            res.status(200).json({ success: true, users });
        } catch (error: any) {
            Logger.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    public async findAllUser(req: Request, res: Response): Promise<any> {
        try {
            const users = req.query.new
                ? await UserModel.find({ role: 'guru' }, { 'data.username': 1, 'data.email': 1, 'data.kelas': 1, role: 1 }).sort({ createdAt: -1 }).limit(Number(req.query.new))
                : await UserModel.find({ role: 'guru' }, { 'data.username': 1, 'data.email': 1, 'data.kelas': 1, role: 1 });
            const siswa = req.query.new
                ? await SiswaModel.find({}, { 'data.username': 1, 'data.kelas': 1, 'data.violation': 1, 'data.amount': 1 }).sort({ createdAt: -1 }).limit(Number(req.query.new))
                : await SiswaModel.find({}, { 'data.username': 1, 'data.kelas': 1, 'data.violation': 1, 'data.amount': 1 });
            res.status(200).json({ success: true, users: { guru: users, siswa } });
        } catch (error) {
            Logger.error(error);
            res.status(500).json({ success: false, message: error });
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
        } catch (error) {
            Logger.error(error);
            res.status(500).json({ success: false, message: error });
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
