import passport from 'passport';
import { Strategy } from 'passport-local';
import UserModel from '../models/user.model';
import { Logger } from '../library/logging.library';
import { generateAccessToken } from '../utils/token.util';
import { createAdmin } from '../services/user.service';

passport.use(
    new Strategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = email === process.env.EMAIL_ADMIN && password === process.env.PASSWORD_ADMIN ? await createAdmin({ email, password }) : await UserModel.findOne({ 'data.email': email });
                if (!user) throw new Error('User not found');
                const valid = await user.comparePassword(password);
                if (!valid) throw new Error('Password not match');
                const { accessToken, refreshToken } = await generateAccessToken(user);
                Object.assign(user, { token: { accessToken, refreshToken } }).save();
                done(null, user);
            } catch (error: any) {
                Logger.error(error);
                done(error.message, null);
            }
        }
    )
);

passport.serializeUser((user: any, done) => done(null, user.id));

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await UserModel.findById(id);
        return done(null, user);
    } catch (error) {
        console.log(error);
        done(error, null);
    }
});

export default passport;
