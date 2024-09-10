import mongoose from "mongoose";

const links = new mongoose.Schema({
  cpu: { type: mongoose.Schema.Types.ObjectId, required: false },
  cpu_cooler: { type: mongoose.Schema.Types.ObjectId, required: false },
  gpu: { type: mongoose.Schema.Types.ObjectId, required: false },
  case: { type: mongoose.Schema.Types.ObjectId, required: false },
  case_fans: { type: mongoose.Schema.Types.Mixed, required: false },
  hard_drives: { type: mongoose.Schema.Types.Mixed, required: false },
  memories: { type: mongoose.Schema.Types.Mixed, required: false },
  motherboards: { type: mongoose.Schema.Types.ObjectId, required: false },
  power_supplies: { type: mongoose.Schema.Types.ObjectId, required: false },
  link: { type: String, required: true },
});

const Links = mongoose.model("Links", links, "links");

export default Links;
