import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const connectDb = async () => {
    try {

        const mongoUri = process.env.MONGO_URI || "";
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        mongoose.connect(mongoUri);

        console.log('Connected to MongoDB');

    } catch (error) {
        console.log('Error connecting db', error);
    }
};