import { connect } from 'mongoose';
import { Logger } from '../library/logging.library';

export const connectToDatabase = async () => {
    try {
        await connect(process.env.MONGODB_URL as string, { w: 'majority', retryWrites: true });
        Logger.info('Connect to database');
    } catch (error) {
        Logger.error(error);
        process.exit(1);
    }
};
