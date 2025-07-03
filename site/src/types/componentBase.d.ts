import { Types } from "mongoose";

export interface ComponentBase {
  _id: Types.ObjectId;
  name: string;
  price_data?: any;
  [key: string]: any;
}
