import mongoose from "mongoose";

const uri = process.env.MONGODB_URI as string;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
};

export default connectMongoDB;
