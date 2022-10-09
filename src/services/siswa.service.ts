import SiswaModel from '../models/siswa.model';
import { slug } from '../library/slug.library';

export const createViolationSiswa = async ({ username, kelas, aspek, poin, deskripsi }: { username: string; kelas: string; aspek: string; poin: number; deskripsi: string }): Promise<any> => {
    const siswa: any = await SiswaModel.findOne({ $and: [{ 'data.username': slug(username) }, { 'data.kelas': kelas }] });
    if (!siswa) return await SiswaModel.create({ data: { username: slug(username), kelas, violation: [{ aspek, poin, deskripsi }], amount: poin } });
    siswa.data.violation.push({ aspek, poin, deskripsi });
    siswa.data.amount = siswa.data.amount + poin;
    siswa.save();
    return siswa;
};
