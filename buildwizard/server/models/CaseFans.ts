import mongoose from "mongoose";

const caseFan = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: false },
  size: { type: Number, required: true },
  color: { type: String, required: true },
  rpm: { type: Number, required: false },
  airflow: { type: Number, required: false },
  noise_level: { type: Number, required: false },
  pwm: { type: Boolean, required: true },
});

const CaseFan = mongoose.model("CaseFan", caseFan);

export default CaseFan;
