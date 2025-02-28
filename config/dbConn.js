import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load .env file

console.log("🔍 MONGO_URI:", process.env.MONGO_URI); // Debugging line

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error('❌ MONGO_URI is not defined. Check your .env file!');
        }

        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
