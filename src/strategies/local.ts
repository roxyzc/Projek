import passport from 'passport';
import { Strategy } from 'passport-local';
import UserModel from '../models/user.model';
import { Logger } from '../library/logging.library';

passport.use(
    new Strategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ 'data.email': email });
                if (!user) throw new Error('User not found');
                const valid = await user.comparePassword(password);
                if (!valid) throw new Error('Password not match');
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
