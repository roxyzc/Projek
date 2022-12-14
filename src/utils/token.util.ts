import jwt from 'jsonwebtoken';

export const generateAccessToken = ({ _id, role }: { _id: string; role: string }) => {
    const accessToken = jwt.sign({ id: _id, role }, process.env.ACCESSTOKEN_SECRET as string, { expiresIn: '5m' });
    const refreshToken = jwt.sign({ id: _id, role }, process.env.REFRESHTOKEN_SECRET as string, { expiresIn: '20m' });
    return Promise.resolve({ accessToken, refreshToken });
};

export const refreshToken = ({ _id, role }: { _id: string; role: string }) => {
    const accessToken = jwt.sign({ id: _id, role }, process.env.ACCESSTOKEN_SECRET as string, { expiresIn: '5m' });
    return Promise.resolve({ accessToken });
};

export const checkToken = (accessToken: string, refreshToken: string): any => {
    if (accessToken === undefined && refreshToken === undefined) return true;
    const valid = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET as string, (error, _decoded): any => {
        if (!error) return false;
        return jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET as string, (error, _decoded): any => {
            if (!error) return false;
            return true;
        });
    });
    return valid;
};
