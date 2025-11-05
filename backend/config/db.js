import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error(
        "❌ MONGO_URI is not set. Create a backend/.env with MONGO_URI or export MONGO_URI in your shell. Example: mongodb://127.0.0.1:27017/cybersim"
      );
      process.exit(1);
    }
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    // print the URI used (helpful for debugging local vs remote)
    console.error("Tried URI:", process.env.MONGO_URI);
    process.exit(1);
  }
};

export default connectDB;
