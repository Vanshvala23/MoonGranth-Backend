import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error in connecting the database`,error);
        proces.exit(1);
    }
};
export default connectDB;