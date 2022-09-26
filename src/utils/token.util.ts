import jwt from 'jsonwebtoken';

export const generateAccessToken = ({ _id, role }: { _id: string; role: string }) => {
    const accessToken = jwt.sign({ id: _id, role }, process.env.ACCESSTOKEN_SECRET as string, { expiresIn: '1s' });
    const refreshToken = jwt.sign({ id: _id, role }, process.env.REFRESHTOKEN_SECRET as string, { expiresIn: '1h' });
    return Promise.resolve({ accessToken, refreshToken });
};

export const refreshToken = ({ _id, role }: { _id: string; role: string }) => {
    const accessToken = jwt.sign({ id: _id, role }, process.env.ACCESSTOKEN_SECRET as string, { expiresIn: '1h' });
    return Promise.resolve({ accessToken });
};
