import mongoose from "mongoose";

const casesShema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: false },
  type: { type: String, required: false },
  color: { type: String, required: false },
  psu: { type: Number, required: false },
  side_panel: { type: String, required: false },
  external_volume: { type: Number, required: false },
  internal_35_bays: { type: Number, required: false },
  price_data: { type: mongoose.Schema.Types.Mixed, required: false },
  image: { type: String, required: false },
});

const Cases = mongoose.model("Cases", casesShema, "cases");

export default Cases;
