import mongoose from "mongoose";

const gpus = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: false },
  chipset: { type: String, required: true },
  memory: { type: Number, required: true },
  core_clock: { type: Number, required: true },
  boost_clock: { type: Number, required: false },
  color: { type: String, required: true },
  length: { type: Number, required: true },
  benchmark: { type: Number, required: true },
});

const Gpus = mongoose.model("Gpus", gpus);

export default Gpus;
