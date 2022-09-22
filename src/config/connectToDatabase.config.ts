import { connect } from 'mongoose';

export const connectToDatabase = async () => {
    try {
        await connect(process.env.MONGODB_URL as string, { w: 'majority', retryWrites: true });
        console.log('Connect to database');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
