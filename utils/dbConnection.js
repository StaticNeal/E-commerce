import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
    try {
        const mongoURL = process.env.MONGO_URL;

        if (!mongoURL) {
            throw new Error('MONGO_URL is not defined in environment variables');
        }

        await mongoose.connect(mongoURL);

        console.log('✓ Connected to MongoDB successfully');
        return mongoose.connection;
    } catch (error) {
        console.error('✗ Database connection failed:', error.message);
        process.exit(1);
    }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('✓ Disconnected from MongoDB');
    } catch (error) {
        console.error('✗ Error disconnecting from database:', error.message);
        process.exit(1);
    }
};

export default connectDB;
