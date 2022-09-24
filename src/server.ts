import express, { Application } from 'express';
import { connectToDatabase } from './config/connectToDatabase.config';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import { errorHandler, notFound } from './middlewares/errorHandlers.middleware';
import route from './routes/auth.route';
import { Logger } from './library/logging.library';
import cookieParser from 'cookie-parser';
import sessionMiddleware from './middlewares/session.middleware';
import morgan from 'morgan';
import 'dotenv/config';
import passport from './strategies/local';

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
app.use('/api', route);

// errors handler
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT as string, (): void => {
    connectToDatabase();
    Logger.info(`Listen at port ${process.env.PORT as string} in mode: ${process.env.NODE_ENV as string}`);
});
