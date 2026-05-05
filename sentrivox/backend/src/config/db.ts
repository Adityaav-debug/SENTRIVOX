import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI missing");
    }

    // Force MongoDB to use sentrivox database
    await mongoose.connect(mongoUri, {
      dbName: "sentrivox"
    });

    console.log("MongoDB connected to sentrivox");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};