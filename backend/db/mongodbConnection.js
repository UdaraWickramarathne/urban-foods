import mongoose from "mongoose";
import config from "./mongoConfig.js";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.db.connectString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

export { connectToDatabase };