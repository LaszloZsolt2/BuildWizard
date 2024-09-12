import mongoose, { Document, Schema, Types } from "mongoose";

interface ComponentDocument extends Document {
  _id: string;
  name: string;
  price?: number;
}

const componentSchema = new Schema<ComponentDocument>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: false },
});

const Component = mongoose.model<ComponentDocument>(
  "Component",
  componentSchema
);

export default Component;
