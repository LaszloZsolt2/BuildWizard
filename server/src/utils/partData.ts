import mongoose from "mongoose";

import type { PartBase } from "../types/partBase";
import { partModels } from "./partModels";
import { PartType } from "../types/partType";
import { componentQuantity } from "../utils/componentQuantity";
import { ComponentsType } from "../types/componentsType";

export async function getPartData(part: string, type: PartType) {
  const parsedPart = JSON.parse(part) as PartBase;
  const model: mongoose.Model<any> = partModels[type];
  if (!model) {
    return null;
  }
  const data = await model.findById(parsedPart._id);
  return data;
}

export async function getPartList(components: ComponentsType) {
  const res: ComponentsType = {};
  type res = {
    [key: string]: any;
    type: PartType;
  };
  let promises: Array<Promise<res>> = [];

  for (const key in components) {
    if (componentQuantity[key as PartType] === "multiple") {
      if (!Array.isArray(components[key])) {
        return;
      }
      // @ts-ignore
      promises = components[key].map((component: string) => ({
        ...getPartData(component, key as PartType),
        type: key,
      }));
    } else {
      const component = components[key as PartType];
      // @ts-ignore
      promises.push({ ...getPartData(component, key as PartType), type: key });
    }
  }

  const promiseRes = await Promise.all(promises);
  // console.log(promiseRes);
  for (const part of promiseRes) {
    if (part) {
      if (componentQuantity[part.type] === "multiple") {
        if (!res[part.type]) {
          res[part.type] = [];
        }
        // @ts-ignore
        res[part.type].push(part);
      } else {
        // @ts-ignore
        res[part.type] = part;
      }
    }
  }
  return res;
}
