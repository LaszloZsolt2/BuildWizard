import mongoose from "mongoose";

const memories = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: false },
  speed: [{ type: Number, required: true }],
  modules: [{ type: Number, required: true }],
  price_per_gb: { type: Number, required: false },
  color: { type: String, required: false },
  first_word_latency: { type: Number, required: false },
  cas_latency: { type: Number, required: true },
  price_data: { type: mongoose.Schema.Types.Mixed, required: false },
  image: { type: String, required: false },
});

const Memories = mongoose.model("Memories", memories, "memories");

export default Memories;
