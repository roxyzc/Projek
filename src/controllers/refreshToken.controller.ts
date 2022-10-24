import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import jwt from 'jsonwebtoken';
import { generateAccessToken, refreshToken } from '../utils/token.util';
import { Logger } from '../library/logging.library';

interface IToken {
    refreshToken(req: Request, res: Response): any;
}

class Token implements IToken {
    public refreshToken = async (req: Request, res: Response): Promise<any> => {
        try {
            const user: any = await UserModel.findOne({ 'token.accessToken': req.token });
            if (!user) return res.status(400).json({ success: false, message: 'your token is wrong' });
            jwt.verify(user.token.refreshToken as string, process.env.REFRESHTOKEN_SECRET as string, async (error: any, _decoded: any): Promise<any> => {
                if (error) {
                    const { accessToken, refreshToken } = await generateAccessToken(user);
                    Object.assign(user, { token: { accessToken, refreshToken } }).save();
                    return res.status(200).json({ success: true, accessToken, refreshToken });
                }
                const { accessToken } = await refreshToken(user);
                user.token.accessToken = accessToken;
                user.save();
                return res.status(200).json({ success: true, accessToken });
            });
        } catch (error: any) {
            Logger.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    };
}

export default Token;
