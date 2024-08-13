import mongoose from "mongoose";

const powerSupplies = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: false },
  type: { type: String, required: true },
  effiency: { type: String, required: false },
  wattage: { type: Number, required: true },
  modular: { type: mongoose.Schema.Types.Mixed, required: false },
  color: { type: String, required: false },
});

const PowerSupplies = mongoose.model("PowerSupplies", powerSupplies);

export default PowerSupplies;
