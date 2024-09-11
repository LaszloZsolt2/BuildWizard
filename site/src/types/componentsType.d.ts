import { PartType } from "./partType";

export type ComponentsType = {
  [key in PartType]?: any;
};
