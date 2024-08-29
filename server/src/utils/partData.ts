import mongoose from "mongoose";

import { PartBase } from "../types/partBase";
import { partModels } from "./partModels";
import { PartType } from "../types/partType";
import { componentQuantity } from "../utils/componentQuantity";
import { ComponentsType } from "../types/componentsType";

export async function getPartData(part: PartBase, type: PartType) {
  const model: mongoose.Model<any> = partModels[type];
  if (!model) {
    return null;
  }
  const data = await model.findById(part._id);
  return data;
}

export async function getPartList(components: ComponentsType) {
  let res = {} as ComponentsType;
  for (const key in components) {
    if (componentQuantity[key as PartType] === "multiple") {
      let data = [];
      for (const component of components[key as PartType]) {
        const part: PartBase = JSON.parse(component);
        const result = await getPartData(part, key as PartType);
        data.push(result);
      }
      res[key] = data;
    } else {
      const part: PartBase = JSON.parse(components[key as PartType]);
      const result = await getPartData(part, key as PartType);
      res[key] = result;
    }
  }
  return res;
}
