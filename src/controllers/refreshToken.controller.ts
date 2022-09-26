import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import jwt from 'jsonwebtoken';
import { refreshToken } from '../utils/token.util';
import { Logger } from '../library/logging.library';

interface IToken {
    refreshToken(req: Request, res: Response): any;
}

class Token implements IToken {
    public refreshToken = async (req: Request, res: Response) => {
        try {
            const user: any = await UserModel.findOne({ 'token.accessToken': req.token });
            jwt.verify(user.token.refreshToken as string, process.env.REFRESHTOKEN_SECRET as string, async (error: any, _decoded: any): Promise<any> => {
                if (error) return res.sendStatus(403);
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
