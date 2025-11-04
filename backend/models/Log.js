import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  command: { type: String, required: true },
  output: { type: String },
  success: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Log", logSchema);
