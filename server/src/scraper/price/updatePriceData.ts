import Cpus from "../../models/Cpus";
import Gpus from "../../models/Gpus";
import { getComponentUrl } from "./componentUrl";
import { getComponentDetails } from "./componentDetails";
import { ComponentWebshopDetails } from "../../types/webshop";
import Memories from "../../models/Memories";
import Motherboards from "../../models/Motherboards";
import CpuCoolers from "../../models/CpuCoolers";
import Cases from "../../models/Cases";
import CaseFan from "../../models/CaseFans";
import HardDrives from "../../models/HardDrives";
import PowerSupplies from "../../models/PowerSupplies";

const BATCH_SIZE = 100;
const DELAY_MS = 60000;

const categories = {
  cpus: ["procesoare"],
  gpus: ["placi-video"],
  memories: ["memorii"],
  motherboards: ["placi-de-baza"],
  "cpu-coolers": ["coolere"],
  cases: ["carcase"],
  "case-fans": ["ventilator-carcasa"],
  "hard-drives": ["ssd", "solid-state-drive", "hard-disk"],
  "power-supplies": ["surse-de-alimentare"],
};

async function updateComponentData(
  components: any,
  getSearchQuery: (component: any) => string,
  type: string
) {
  let processedCount = 0;

  for (const component of components) {
    //if (!component.price_data) {
    // continue;
    //}

    try {
      const searchQuery = getSearchQuery(component);
      const componentUrl = await getComponentUrl(
        searchQuery,
        categories[type as keyof typeof categories]
      );
      console.log("Updating price data for component:", searchQuery);
      if (!componentUrl) throw new Error("Component URL not found");

      const componentDetails = (await getComponentDetails(
        componentUrl
      )) as ComponentWebshopDetails;
      if (!componentDetails) throw new Error("Component details not found");

      const priceData = componentDetails.offers;

      component.price_data = priceData;
      component.image = componentDetails.componentImage;
      await component.save();

      console.log(`Updated price data for component: ${searchQuery}`);
    } catch (error) {
      // component.price_data = null;
      // component.image = null;
      // await component.save();
      console.error(
        `Price not found for component ${getSearchQuery(component)}`
      );
    }

    processedCount++;
    if (processedCount % BATCH_SIZE === 0) {
      console.log(`Processed ${processedCount} items. Taking a break...`);
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  console.log("Finished updating components.");
}

export async function updatePriceData() {
  const components = {} as any;

  const [
    cpus,
    gpus,
    memories,
    motherboards,
    cpuCoolers,
    cases,
    caseFans,
    hardDrives,
    powerSupplies,
  ] = await Promise.all([
    Cpus.find({}),
    Gpus.find({}),
    Memories.find({}),
    Motherboards.find({}),
    CpuCoolers.find({}),
    Cases.find({}),
    CaseFan.find({}),
    HardDrives.find({}),
    PowerSupplies.find({}),
  ]);

  components.cpus = {
    items: cpus,
    query: (component: any) => component.name,
  };

  components.gpus = {
    items: gpus,
    query: (component: any) => `${component.name} ${component.chipset}`,
  };

  components.memories = {
    items: memories,
    query: (component: any) =>
      `${component.name} DDR${component.speed[0]} ${component.speed[1]}`,
  };

  components.motherboards = {
    items: motherboards,
    query: (component: any) => component.name,
  };

  components["cpu-coolers"] = {
    items: cpuCoolers,
    query: (component: any) => component.name,
  };

  components.cases = {
    items: cases,
    query: (component: any) => component.name,
  };

  components["case-fans"] = {
    items: caseFans,
    query: (component: any) => component.name,
  };

  components["hard-drives"] = {
    items: hardDrives,
    query: (component: any) => `${component.name} ${component.capacity}`,
  };

  components["power-supplies"] = {
    items: powerSupplies,
    query: (component: any) => `${component.name} ${component.wattage}`,
  };

  for (const key in components) {
    const component = components[key];
    await updateComponentData(component.items, component.query, key);
  }

  console.log("Finished updating price data for all components");
}
