import UserModel from '../models/user.model';
import { slug } from '../library/slug.library';

export const createUser = async ({ username, email, password, kelas }: { username: string; email: string; password: string; kelas?: string }) => {
    try {
        const user = await UserModel.findOne({ 'data.email': email });
        return user ? Promise.reject('Email is already in use by another user') : await UserModel.create({ data: { username: slug(username), email, password, kelas } });
    } catch (error: any) {
        if (!error.errors['data.kelas']) throw new Error(error);
        throw new Error('kelas is a required');
    }
};
