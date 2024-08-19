import mongoose from "mongoose";

const systemRequirements = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  minimum: {
    type: new mongoose.Schema(
      {
        cpu: [{ type: String, required: true }],
        ram: { type: Number, required: true },
        gpu: [{ type: String, required: false }],
        vram: { type: Number, required: false },
      },
      { _id: false }
    ),
    required: false,
  },
  recommended: {
    type: new mongoose.Schema(
      {
        cpu: [{ type: String, required: true }],
        ram: { type: Number, required: true },
        gpu: [{ type: String, required: false }],
        vram: { type: Number, required: false },
      },
      { _id: false }
    ),
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
