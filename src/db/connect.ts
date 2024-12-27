import mongoose from "mongoose";

const connectDb = async (connectionString: string) => {
    return mongoose.connect(connectionString);
};

export default connectDb;
