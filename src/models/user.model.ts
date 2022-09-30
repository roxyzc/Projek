import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import 'dotenv/config';

export interface IUser {
    data: {
        username: String;
        password: String;
        kelas?: String;
        email: String;
    };
    role: string;
    token: {
        accessToken: string;
        refreshToken: string;
    };
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<Boolean>;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        _id: {
            type: String,
            default: function () {
                return v4();
            }
        },
        data: {
            username: {
                type: String,
                required: true,
                min: 6,
                max: 12
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true,
                min: 12,
                max: 24
            },
            kelas: {
                type: String,
                required: function (this: IUser) {
                    return (this.data.username === process.env.USERNAME_ADMIN && this.data.password === process.env.PASSWORD_ADMIN && this.data.email === process.env.EMAIL_ADMIN) ||
                        this.role === 'admin'
                        ? false
                        : true;
                },
                default: undefined
            }
        },
        role: {
            type: String,
            enum: ['admin', 'guru'],
            default: function (this: IUser) {
                return this.data.username === process.env.USERNAME_ADMIN && this.data.password === process.env.PASSWORD_ADMIN && this.data.email === process.env.EMAIL_ADMIN ? 'admin' : 'guru';
            }
        },
        token: {
            accessToken: {
                type: String,
                required: false,
                default: undefined
            },
            refreshToken: {
                type: String,
                required: false,
                default: undefined
            }
        }
    },
    { timestamps: true, versionKey: false }
);

UserSchema.pre('save', async function (this: IUserModel, next) {
    if (!this.isModified('data')) {
        return next();
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hash = await bcrypt.hash(this.data.password as string, salt);
    this.data.password = hash;
    return next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<Boolean> {
    const user = this as IUserModel;
    return await bcrypt.compare(candidatePassword, user.data.password as string).catch(() => false);
};

export default model<IUserModel>('User', UserSchema);
