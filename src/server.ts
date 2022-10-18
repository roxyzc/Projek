import express, { Application } from 'express';
import { connectToDatabase } from './config/connectToDatabase.config';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import { errorHandler, notFound } from './middlewares/errorHandlers.middleware';
import routeAuth from './routes/auth.route';
import routeUser from './routes/user.route';
import routeSiswa from './routes/siswa.route';
import { Logger } from './library/logging.library';
import cookieParser from 'cookie-parser';
import sessionMiddleware from './middlewares/session.middleware';
import morgan from 'morgan';
import 'dotenv/config';
import passport from './strategies/local';

// connect to database
connectToDatabase();

const app: Application = express();

// middleware
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(
    cors({
        origin: process.env.ORIGIN
    })
);

app.use(cookieParser());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// route
app.use('/api', routeAuth);
app.use('/api/user', routeUser);
app.use('/api/user', routeSiswa);

// errors handler
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT as string, (): void => {
    Logger.info(`Listen at port ${process.env.PORT as string} in mode: ${process.env.NODE_ENV as string}`);
});
