import mongoose from "mongoose";

const caseFanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: false },
  size: { type: Number, required: true },
  color: { type: String, required: true },
  rpm: [{ type: Number, required: false }],
  airflow: [{ type: Number, required: false }],
  noise_level: [{ type: Number, required: false }],
  pwm: { type: Boolean, required: true },
});

const CaseFan = mongoose.model("CaseFan", caseFanSchema, "case-fans");

export default CaseFan;
