import { Response, Request } from 'express';
import { Logger } from '../library/logging.library';
import { createUser } from '../services/user.service';

class User {
    public async register(req: Request, res: Response) {
        try {
            const user = await createUser(req.body);
            res.status(200).json({ success: true, message: 'account created successfully', user });
        } catch (error) {
            Logger.error(error);
            res.status(500).json({ success: false, error });
        }
    }
}

export default User;
