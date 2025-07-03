import mongoose from "mongoose";

const motherboards = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: false },
  socket: { type: String, required: true },
  form_factor: { type: String, required: true },
  max_memory: { type: Number, required: true },
  memory_slots: { type: Number, required: true },
  color: { type: String, required: false },
  price_data: { type: mongoose.Schema.Types.Mixed, required: false },
  image: { type: String, required: false },
});

const Motherboards = mongoose.model(
  "Motherboards",
  motherboards,
  "motherboards"
);

export default Motherboards;
