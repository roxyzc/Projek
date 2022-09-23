import UserModel from '../models/user.model';
import { slug } from '../library/slug.library';

export const createUser = async ({ username, email, password }: { username: string; email: string; password: string }) => {
    try {
        const user = await UserModel.findOne({ 'data.email': email });
        return user ? Promise.reject('Email is already in use by another user') : await UserModel.create({ data: { username: slug(username), email, password } });
    } catch (error: any) {
        throw new Error(error);
    }
};
