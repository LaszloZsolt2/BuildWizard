import mongoose from "mongoose";

const gpus = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: false },
  chipset: { type: String, required: true },
  memory: { type: Number, required: true },
  core_clock: { type: Number, required: false },
  boost_clock: { type: Number, required: false },
  color: { type: String, required: false },
  length: { type: Number, required: false },
  benchmark: { type: Number, required: true },
  price_data: { type: mongoose.Schema.Types.Mixed, required: false },
  image: { type: String, required: false },
});

const Gpus = mongoose.model("Gpus", gpus, "gpus");

export default Gpus;
