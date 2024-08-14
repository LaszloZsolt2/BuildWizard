import mongoose from "mongoose";

const cpuCoolers = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: false },
  rpm: { type: Number, required: true },
  noise_level: { type: Number, required: true },
  size: { type: Number, required: false },
});

const CpuCoolers = mongoose.model("CpuCoolers", cpuCoolers, "cpu-coolers");

export default CpuCoolers;
