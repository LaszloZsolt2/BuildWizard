import mongoose from "mongoose";

const links = new mongoose.Schema({
  link: { type: String, required: true },
  cpu: { type: mongoose.Schema.Types.ObjectId, required: false },
  cpu_cooler: { type: mongoose.Schema.Types.ObjectId, required: false },
  gpu: { type: mongoose.Schema.Types.ObjectId, required: false },
  case: { type: mongoose.Schema.Types.ObjectId, required: false },
  case_fans: { type: mongoose.Schema.Types.ObjectId, required: false },
  hard_drives: { type: mongoose.Schema.Types.ObjectId, required: false },
  memories: { type: mongoose.Schema.Types.ObjectId, required: false },
  motherboards: { type: mongoose.Schema.Types.ObjectId, required: false },
  power_supplies: { type: mongoose.Schema.Types.ObjectId, required: false },
});

const Links = mongoose.model("Links", links, "links");

export default Links;
