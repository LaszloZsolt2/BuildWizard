import mongoose from "mongoose";

const cases = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: false },
  type: { type: String, required: true },
  color: { type: String, required: true },
  psu: { type: Number, required: false },
  side_panel: { type: String, required: false },
  external_volume: { type: Number, required: false },
  internal_35_bays: { type: Number, required: true },
});

const Cases = mongoose.model("Cases", cases);

export default Cases;
