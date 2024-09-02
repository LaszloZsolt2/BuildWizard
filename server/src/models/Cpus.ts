import mongoose from "mongoose";

const cpus = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: false },
  core_count: { type: Number, required: true },
  core_clock: { type: Number, required: true },
  boost_clock: { type: Number, required: false },
  tdp: { type: Number, required: true },
  graphics: { type: String, required: false },
  smt: { type: Boolean, required: true },
  benchmark: { type: Number, required: true },
  socket: { type: String, required: true },
  price_data: { type: mongoose.Schema.Types.Mixed, required: false },
  image: { type: String, required: false },
});

const Cpus = mongoose.model("Cpus", cpus, "cpus");

export default Cpus;
