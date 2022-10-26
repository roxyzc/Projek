import { Request, Response } from 'express';
import { Logger } from '../library/logging.library';
import UserModel from '../models/user.model';
import SiswaModel from '../models/siswa.model';
import { createViolationSiswa } from '../services/siswa.service';
import siswaModel from '../models/siswa.model';

interface ISiswa {
    createViolationSiswa(req: Request, res: Response): any;
    findSiswa(req: Request, res: Response): any;
    findAllSiswa(req: Request, res: Response): any;
    deleteSiswa(req: Request, res: Response): any;
    findStat(req: Request, res: Response): any;
}

class Siswa implements ISiswa {
    public async createViolationSiswa(req: Request, res: Response) {
        try {
            const user = await createViolationSiswa(req.body);
            res.status(200).json({ success: true, message: 'succeeded in violating the student', user });
        } catch (error: any) {
            Logger.error(error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    public async findSiswa(req: Request, res: Response) {
        try {
            const user: any = await UserModel.findById(req.User.id);
            if (!user) throw new Error('User not found');
            const users = user.data.kelas
                ? await SiswaModel.find({ 'data.kelas': user.data.kelas }, { 'data.username': 1, 'data.kelas': 1, 'data.violation': 1, 'data.amount': 1 }).sort({ updatedAt: -1 }).limit(10)
                : false;
            if (!users) throw new Error("you can't access this");
            res.status(200).json({ success: true, users });
        } catch (error: any) {
            Logger.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // public async filterUserAlfabet(_req: Request, res: Response) {
    //     try {
    //         const users = await SiswaModel.find({}, { 'data.username': 1, 'data.kelas': 1, 'data.violation': 1, 'data.amount': 1 }).sort({ 'data.username': -1 }).limit(10);
    //         res.status(200).json({ success: true, users });
    //     } catch (error: any) {
    //         Logger.error(error);
    //         res.status(500).json({ success: false, message: error.message });
    //     }
    // }

    public async findAllSiswa(req: Request, res: Response): Promise<any> {
        try {
            const { querynew, alfabet } = req.query;
            if (((querynew !== undefined || null) && (alfabet !== undefined || null)) || (!querynew && (alfabet !== undefined || null))) {
                const siswa = !querynew
                    ? await SiswaModel.find({ 'data.username': { $regex: alfabet as string, $options: 'i' } }, { 'data.username': 1, 'data.kelas': 1, 'data.amount': 1, _id: 0 }).sort({
                          'data.username': 1
                      })
                    : await SiswaModel.find({ 'data.username': { $regex: alfabet as string, $options: 'i' } }, { 'data.username': 1, 'data.kelas': 1, 'data.violation': 1, 'data.amount': 1, _id: 0 })
                          .sort({ 'data.username': 1 })
                          .limit(Number(querynew));
                return res.status(200).json({ success: true, siswa });
            }
            const siswa = querynew
                ? await SiswaModel.find({}, { 'data.username': 1, 'data.kelas': 1, 'data.violation': 1, 'data.amount': 1 }).sort({ createdAt: -1 }).limit(Number(querynew))
                : await SiswaModel.find({}, { 'data.username': 1, 'data.kelas': 1, 'data.violation': 1, 'data.amount': 1 });
            return res.status(200).json({ success: true, siswa });
        } catch (error: any) {
            Logger.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    public async deleteSiswa(req: Request, res: Response): Promise<any> {
        try {
            const user = await UserModel.findById(req.session.passport?.user);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });
            const siswa = await SiswaModel.findById(req.params.id);
            if (!siswa) return res.status(400).json({ success: false, message: 'Siswa not found' });
            if (user?.data.kelas !== siswa?.data.kelas && user.role !== 'admin') return res.status(400).json({ success: false, message: "you can't access this" });
            await siswa?.delete();
            return res.status(200).json({ success: true, message: 'delete siswa successfully' });
        } catch (error: any) {
            Logger.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    public async findStat(_req: Request, res: Response) {
        try {
            const siswa = await SiswaModel.find(
                {
                    createdAt: {
                        $lt: new Date(),
                        $gte: new Date(new Date().setDate(new Date().getDate() - 7))
                    }
                },
                { 'data.username': 1, 'data.kelas': 1, 'data.amount': 1, 'data.violation': 1, createdAt: 1, _id: 0 }
            );
            res.status(200).json({ success: true, siswa });
        } catch (error: any) {
            Logger.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    public async findRank(_req: Request, res: Response) {
        try {
            const siswa = await siswaModel.find({}, { 'data.username': 1, 'data.amount': 1, 'data.violation': 1, _id: 0 }).sort({ 'data.amount': -1 }).limit(10);
            res.status(200).json({ success: true, siswa });
        } catch (error: any) {
            Logger.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default Siswa;
