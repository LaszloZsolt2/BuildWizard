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
  const res: ComponentsType = {};
  const promises: Array<Promise<any>> = [];

  for (const key in components) {
    if (componentQuantity[key as PartType] === "multiple") {
      const dataPromises = (components[key as PartType] as string[]).map(
        async (component) => {
          const part: PartBase = JSON.parse(component);
          return getPartData(part, key as PartType);
        }
      );

      promises.push(
        (async () => {
          const data = await Promise.all(dataPromises);
          res[key] = data;
        })()
      );
    } else {
      const component = components[key as PartType];
      const part: PartBase = JSON.parse(component);

      promises.push(
        (async () => {
          res[key] = await getPartData(part, key as PartType);
        })()
      );
    }
  }

  await Promise.all(promises);
  return res;
}
