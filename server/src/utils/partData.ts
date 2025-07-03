import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import { PartBase } from "../types/partBase";
import { partModels } from "./partModels";
import { PartType } from "../types/partType";
import { componentQuantity } from "../utils/componentQuantity";
import { ComponentsType } from "../types/componentsType";

dotenv.config();

export async function getPartData(part: string, type: PartType) {
  const model: mongoose.Model<any> = partModels[type];
  if (!model) {
    return null;
  }

  let data;
  if (typeof part === "string") {
    data = await model.findById(JSON.parse(part)._id);
  } else {
    data = await model.findById(part._id);
  }
  return data;
}

export async function getPartList(components: ComponentsType) {
  try {
    const res: ComponentsType = {};
    const promises: Array<Promise<any>> = [];

    for (const k in components) {
      const key = k as PartType;
      if (componentQuantity[key] === "multiple") {
        const dataPromises = (components[key] as string[]).map(
          async (component) => {
            const part = JSON.parse(JSON.stringify(component));
            return getPartData(part, key);
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
        const part: PartBase = JSON.parse(JSON.stringify(component));

        promises.push(
          (async () => {
            res[key] = await getPartData(part, key);
          })()
        );
      }
    }

    await Promise.all(promises);
    return res;
  } catch (err: unknown) {
    console.error(err);
    return null;
  }
}

let getAllParts: () => Promise<ComponentsType>;

// store cached parts data in a file so that the data is not lost when the server restarts (while in development)
if (process.env.NODE_ENV === "development") {
  const CACHE_DURATION_MS = 300000;
  const CACHE_FILE_PATH = path.join(__dirname, "partsCache.json");

  function readCacheFromFile(): {
    data: ComponentsType | null;
    timestamp: number | null;
  } {
    try {
      const fileContent = fs.readFileSync(CACHE_FILE_PATH, "utf8");
      const { data, timestamp } = JSON.parse(fileContent);
      return { data, timestamp };
    } catch (err) {
      return { data: null, timestamp: null };
    }
  }

  function writeCacheToFile(data: ComponentsType, timestamp: number) {
    const fileContent = JSON.stringify({ data, timestamp }, null, 2);
    fs.writeFileSync(CACHE_FILE_PATH, fileContent);
  }

  getAllParts = async function () {
    const { data: cachedData, timestamp: lastFetchedTime } =
      readCacheFromFile();
    const currentTime = Date.now();

    if (
      cachedData &&
      lastFetchedTime &&
      currentTime - lastFetchedTime < CACHE_DURATION_MS
    ) {
      return cachedData;
    }

    const res: ComponentsType = {};
    const promises: Array<Promise<any>> = [];

    for (const k in partModels) {
      const key = k as PartType;
      const model: mongoose.Model<any> = partModels[key];
      promises.push(
        model.find().then((data) => {
          res[key] = data;
        })
      );
    }

    await Promise.all(promises);

    writeCacheToFile(res, currentTime);

    return res;
  };
} else if (process.env.NODE_ENV === "production") {
  // store cached parts data in memory
  const CACHE_DURATION_MS = 300000; // 5 minutes
  let cachedData: ComponentsType | null = null;
  let lastFetchedTime: number | null = null;

  getAllParts = async function () {
    const currentTime = Date.now();

    if (
      cachedData &&
      lastFetchedTime &&
      currentTime - lastFetchedTime < CACHE_DURATION_MS
    ) {
      return cachedData;
    }

    const res: ComponentsType = {};
    const promises: Array<Promise<any>> = [];

    for (const k in partModels) {
      const key = k as PartType;
      const model: mongoose.Model<any> = partModels[key];
      promises.push(
        model.find().then((data) => {
          res[key] = data;
        })
      );
    }

    await Promise.all(promises);

    cachedData = res;
    lastFetchedTime = currentTime;

    return res;
  };
} else {
  throw new Error("NODE_ENV not set");
}

export { getAllParts };

export function transformComponents(components: ComponentsType) {
  const transformed = {} as ComponentsType;

  for (const k in components) {
    const key = k as PartType;
    const value = components[key];

    if (Array.isArray(value)) {
      transformed[key] = value.map((id) => ({ _id: id }));
    } else {
      transformed[key] = { _id: value };
    }
  }

  return transformed;
}
