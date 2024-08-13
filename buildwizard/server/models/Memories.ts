import mongoose from "mongoose";

const memories = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: false },
  speed: { type: Number, required: true },
  modules: { type: Number, required: true },
  price_per_gb: { type: Number, required: false },
  color: { type: String, required: true },
  first_word_latency: { type: Number, required: true },
  cas_latency: { type: Number, required: true },
});

const Memories = mongoose.model("Memories", memories);

export default Memories;
