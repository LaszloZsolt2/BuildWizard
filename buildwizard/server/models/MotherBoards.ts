import mongoose from "mongoose";

const motherBoards = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: false },
  socket: { type: String, required: true },
  form_factor: { type: String, required: true },
  max_memory: { type: Number, required: true },
  memory_slots: { type: Number, required: true },
  color: { type: String, required: true },
});

const MotherBoards = mongoose.model("MotherBoards", motherBoards);

export default MotherBoards;
