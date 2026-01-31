import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        const uri = process.env.MONGO_URI ? process.env.MONGO_URI.trim() : "";

        if (!uri) {
            console.error("MONGO_URI is missing in environment variables");
            throw new Error("MONGO_URI is missing");
        }

        cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log("MongoDB Connected (Cached)");
    } catch (e) {
        cached.promise = null;
        console.error("MongoDB connection error:", e);
        throw e;
    }

    return cached.conn;
};

export default connectDB;
