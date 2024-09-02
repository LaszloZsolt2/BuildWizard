import mongoose from "mongoose";

const caseFanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: false },
  size: { type: Number, required: false },
  color: { type: String, required: false },
  rpm: [{ type: Number, required: false }],
  airflow: [{ type: Number, required: false }],
  noise_level: [{ type: Number, required: false }],
  pwm: { type: Boolean, required: false },
  price_data: { type: mongoose.Schema.Types.Mixed, required: false },
  image: { type: String, required: false },
});

const CaseFan = mongoose.model("CaseFan", caseFanSchema, "case-fans");

export default CaseFan;
