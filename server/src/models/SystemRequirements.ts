import mongoose from "mongoose";

const requirements = new mongoose.Schema(
  {
    cpu: [{ type: String, required: true }],
    ram: { type: Number, required: true },
    gpu: [{ type: String, required: false }],
    vram: { type: Number, required: false },
  },
  { _id: false }
);

const systemRequirements = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  minimum: {
    type: requirements,
    required: false,
  },
  recommended: {
    type: requirements,
    required: false,
  },
  space: { type: Number, required: true },
});

const SystemRequirements = mongoose.model(
  "SystemRequirements",
  systemRequirements,
  "system-requirements"
);

export default SystemRequirements;
