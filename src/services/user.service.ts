import UserModel from '../models/user.model';
import { slug } from '../library/slug.library';

export const createUser = async ({ username, email, password, kelas }: { username: string; email: string; password: string; kelas: string }) => {
    // try {
    const user = await UserModel.findOne({ 'data.email': email });
    if (!user) return await UserModel.create({ data: { username: slug(username), email, password, kelas } });
    throw new Error('Email is already in use by another user');
    // } catch (error: any) {
    //     throw new Error(error);
    // }
};

export const createAdmin = async ({ email, password }: { email: string; password: string }): Promise<any> => {
    const user = await UserModel.findOne({ 'data.email': email });
    if (!user) return await UserModel.create({ data: { username: process.env.USERNAME_ADMIN, email, password } });
    return user;
};
