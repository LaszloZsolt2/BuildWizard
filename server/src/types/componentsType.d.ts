import { PartBase } from "./partBase";

export type ComponentsType = {
  [key in PartType]: PartBase | PartBase[];
};
