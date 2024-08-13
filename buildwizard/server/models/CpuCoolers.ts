import mongoose from "mongoose";

const cpuCoolers = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: false },
  rpm: { type: Number, required: true },
  noise_level: { type: Number, required: true },
  size: { type: Number, required: false },
});

const CpuCoolers = mongoose.model("CpuCoolers", cpuCoolers);

export default CpuCoolers;
