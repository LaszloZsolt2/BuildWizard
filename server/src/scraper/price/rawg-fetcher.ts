import axios from "axios";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config({ path: "/home/zsolt/buildwizard/BuildWizard/server/.env" });

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = "https://api.rawg.io/api";
const MONGO_URI = process.env.MONGO_URI!;
const COLLECTION_NAME = "system-requirements";
const TOTAL_PAGES = 2; // növeld, ha több játék kell

console.log("RAWG_API_KEY:", RAWG_API_KEY);

async function fetchAllGames() {
  let allGames: any[] = [];
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    console.log(`🔄 Lekérés: ${page}. oldal`);
    const res = await axios.get(`${RAWG_BASE_URL}/games`, {
      params: {
        key: RAWG_API_KEY,
        page,
        page_size: 40,
      },
    });
    allGames = allGames.concat(res.data.results);
  }
  return allGames;
}
const knownVRAMs: Record<string, number> = {
  // NVIDIA GeForce sorozat
  "GeForce GTX 750 Ti": 2,
  "GeForce GTX 760": 2,
  "GeForce GTX 770": 2,
  "GeForce GTX 950": 2,
  "GeForce GTX 960": 2,
  "GeForce GTX 970": 4,
  "GeForce GTX 980": 4,
  "GeForce GTX 1050": 2,
  "GeForce GTX 1050 Ti": 4,
  "GeForce GTX 1060": 6,
  "GeForce GTX 1070": 8,
  "GeForce GTX 1080": 8,
  "GeForce GTX 1650": 4,
  "GeForce GTX 1660": 6,
  "GeForce RTX 2060": 6,
  "GeForce RTX 2070": 8,
  "GeForce RTX 2080": 8,
  "GeForce RTX 3060": 12,
  "GeForce RTX 3060 Ti": 8,
  "GeForce RTX 3070": 8,
  "GeForce RTX 3080": 10,
  "GeForce RTX 3090": 24,
  "GeForce RTX 4060": 8,
  "GeForce RTX 4070": 12,
  "GeForce RTX 4080": 16,
  "GeForce RTX 4090": 24,

  // AMD Radeon sorozat
  "Radeon RX 460": 2,
  "Radeon RX 470": 4,
  "Radeon RX 480": 8,
  "Radeon RX 550": 2,
  "Radeon RX 560": 4,
  "Radeon RX 570": 4,
  "Radeon RX 580": 8,
  "Radeon RX 590": 8,
  "Radeon RX Vega 56": 8,
  "Radeon RX Vega 64": 8,
  "Radeon RX 5500 XT": 8,
  "Radeon RX 5600 XT": 6,
  "Radeon RX 5700": 8,
  "Radeon RX 5700 XT": 8,
  "Radeon RX 6600": 8,
  "Radeon RX 6700 XT": 12,
  "Radeon RX 6800": 16,
  "Radeon RX 6800 XT": 16,
  "Radeon RX 6900 XT": 16,
  "Radeon RX 7600": 8,
  "Radeon RX 7700 XT": 12,
  "Radeon RX 7800 XT": 16,
  "Radeon RX 7900 XT": 20,
  "Radeon RX 7900 XTX": 24,

  // Régebbi modellek
  "Radeon R9 280": 3,
  "Radeon R9 290": 4,
  "Radeon R9 380": 2,
  "GeForce GTX 660": 2,
  "GeForce GTX 670": 2,
  "GeForce GTX 680": 2,
  "GeForce GTX 750": 1,
  "GeForce GTX 860M": 2,
  "GeForce 8800": 0.512,
  "Radeon X1900": 0.256,

  // Intel integrált megoldások
  "Intel HD Graphics 4000": 0.128,
  "Intel HD Graphics 5000": 0.256,
  "Intel UHD Graphics 620": 0.5,
  "Intel Iris Plus": 1,
  "Intel Iris Xe": 1,
};

function estimateVRAMFromGPU(gpuName?: string): number | undefined {
  if (!gpuName) return undefined;
  for (const key in knownVRAMs) {
    if (gpuName.toLowerCase().includes(key.toLowerCase())) {
      return knownVRAMs[key];
    }
  }
  return undefined;
}

function isEmptyRequirements(req: any): boolean {
  return (
    (!req.cpu || req.cpu.length === 0) &&
    (!req.gpu || req.gpu.length === 0) &&
    req.ram == null &&
    req.vram == null
  );
}

async function fetchGameDetail(gameId: number) {
  const detail = await axios.get(`${RAWG_BASE_URL}/games/${gameId}`, {
    params: { key: RAWG_API_KEY },
  });

  const game = detail.data;
  const pcReqs = game.platforms?.find(
    (p: any) => p.platform.name === "PC"
  )?.requirements;

  if (!pcReqs) return null;

  const { minimum, recommended, space } = parseRequirements(pcReqs);

  // Ha minden info hiányzik, ne mentsük
  if (isEmptyRequirements(minimum) && isEmptyRequirements(recommended))
    return null;

  return {
    name: game.name,
    slug: game.slug,
    type: "game",
    minimum,
    recommended,
    space, // külön mezőként tároljuk a storage-ot
  };
}

function extractNumberSmart(
  text: string,
  regexes: RegExp[]
): number | undefined {
  for (const regex of regexes) {
    const match = regex.exec(text);
    if (match) return parseInt(match[1], 10);
  }
  return undefined;
}

function parseSingleRequirement(text?: string) {
  if (!text) {
    return {
      cpu: [],
      gpu: [],
      ram: null,
      vram: null,
    };
  }

  const cpu = extractComponent(text, /(?:CPU|Processor):?\s*([^\n\r]+)/i);
  const gpu = extractComponent(
    text,
    /(?:GPU|Graphics|Video Card):?\s*([^\n\r]+)/i
  );

  const ram =
    extractNumberSmart(text, [
      /(?:Memory|RAM):?\s*(\d+)\s*GB/i,
      /(\d+)\s*GB\s*(?:RAM|memory)/i,
    ]) ?? null;

  const vram =
    extractNumberSmart(text, [/(?:VRAM):?\s*(\d+)\s*GB/i]) ??
    estimateVRAMFromGPU(gpu ?? undefined) ??
    null;

  const space =
    extractNumberSmart(text, [
      /(?:Storage|Disk Space|Hard Drive|Available Space):?\s*(\d+)\s*GB/i,
      /(\d+)\s*GB\s*(?:storage|space|disk)/i,
    ]) ?? null;

  return {
    cpu: cpu ? [cpu] : [],
    gpu: gpu ? [gpu] : [],
    ram,
    vram,
    space,
  };
}

function parseRequirements(req?: { minimum?: string; recommended?: string }) {
  const minParsed = parseSingleRequirement(req?.minimum);
  const recParsed = parseSingleRequirement(req?.recommended);

  const commonSpace = minParsed.space ?? recParsed.space ?? null;

  delete minParsed.space;
  delete recParsed.space;

  return {
    minimum: minParsed,
    recommended: recParsed,
    space: commonSpace,
  };
}

function extractComponent(text: string, regex: RegExp): string | null {
  const match = regex.exec(text);
  return match ? match[1].trim() : null;
}

function extractNumber(text: string, regex: RegExp): number | undefined {
  const match = regex.exec(text);
  return match ? parseInt(match[1], 10) : undefined;
}

async function saveToMongo(data: any[]) {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(); // Alapértelmezett adatbázis a URI-ból
  const collection = db.collection(COLLECTION_NAME);

  for (const game of data) {
    if (game) {
      await collection.updateOne(
        { name: game.name },
        { $set: game },
        { upsert: true }
      );
      console.log(`✅ Mentve: ${game.name}`);
    }
  }

  await client.close();
}

(async () => {
  const baseGames = await fetchAllGames();
  const fullGames = [];
  for (const g of baseGames) {
    const detailed = await fetchGameDetail(g.id);
    if (detailed) {
      fullGames.push(detailed);
    }
  }
  await saveToMongo(fullGames);
})();
