import { Response, Request } from 'express';

export const register = (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    return res.status(200).json({ success: true, data: { username, email, password } });
};
