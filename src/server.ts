import express, { Application } from 'express';
import { connectToDatabase } from './config/connectToDatabase.config';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import { errorHandler, notFound } from './middlewares/errorHandlers.middleware';
import route from './routes/user.route';
import 'dotenv/config';

const app: Application = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());

// route
app.use('/api', route);

// errors handler
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT as string, (): void => {
    connectToDatabase();
    console.log(`Listen at port ${process.env.PORT as string} in mode: ${process.env.NODE_ENV as string}`);
});
