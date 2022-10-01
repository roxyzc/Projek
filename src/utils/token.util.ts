import jwt from 'jsonwebtoken';

export const generateAccessToken = ({ _id, role }: { _id: string; role: string }) => {
    const accessToken = jwt.sign({ id: _id, role }, process.env.ACCESSTOKEN_SECRET as string, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: _id, role }, process.env.REFRESHTOKEN_SECRET as string, { expiresIn: '1h' });
    return Promise.resolve({ accessToken, refreshToken });
};

export const refreshToken = ({ _id, role }: { _id: string; role: string }) => {
    const accessToken = jwt.sign({ id: _id, role }, process.env.ACCESSTOKEN_SECRET as string, { expiresIn: '1h' });
    return Promise.resolve({ accessToken });
};

export const checkToken = async (accessToken: string, refreshToken: string): Promise<any> => {
    if (accessToken === undefined && refreshToken === undefined) return true;
    return jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET as string, async (error, _decoded): Promise<any> => {
        if (!error) return false;
        jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET as string, (error, _decoded) => {
            if (!error) return false;
            return true;
        });
    });
};
