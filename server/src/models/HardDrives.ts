import mongoose from "mongoose";

const hardDrives = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: false },
  capacity: { type: Number, required: true },
  price_per_gb: { type: Number, required: false },
  type: { type: mongoose.Schema.Types.Mixed, required: false },
  cache: { type: Number, required: false },
  form_factor: { type: mongoose.Schema.Types.Mixed, required: false },
  interface: { type: String, required: true },
});

const HardDrives = mongoose.model("HardDrives", hardDrives, "hard-drives");

export default HardDrives;
