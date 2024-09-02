import Cpus from "../../models/Cpus";
import Gpus from "../../models/Gpus";
import { getComponentUrl } from "./componentUrl";
import { getComponentDetails } from "./componentDetails";
import { ComponentWebshopDetails } from "../../types/webshop";
import pLimit from "p-limit";
import Memories from "../../models/Memories";
import Motherboards from "../../models/Motherboards";
import CpuCoolers from "../../models/CpuCoolers";
import Cases from "../../models/Cases";
import CaseFan from "../../models/CaseFans";
import HardDrives from "../../models/HardDrives";
import PowerSupplies from "../../models/PowerSupplies";

const CONCURRENCY_LIMIT = 2;
const BATCH_SIZE = 100;
const DELAY_MS = 900000;
const limit = pLimit(CONCURRENCY_LIMIT);

async function updateComponentData(
  components: any,
  getSearchQuery: (component: any) => string
) {
  let processedCount = 0;

  for (const component of components) {
    await limit(async () => {
      try {
        const searchQuery = getSearchQuery(component);
        const componentUrl = await getComponentUrl(searchQuery);
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
    });

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
  components.cpus = {
    items: await Cpus.find({}),
    query: (component: any) => component.name,
  };
  components.gpus = {
    items: await Gpus.find({}),
    query: (component: any) => `${component.name} ${component.chipset}`,
  };
  components.memories = {
    items: await Memories.find({}),
    query: (component: any) =>
      `${component.name} DDR${component.speed[0]} ${component.speed[1]}`,
  };
  components.motherboards = {
    items: await Motherboards.find({}),
    query: (component: any) => component.name,
  };
  components["cpu-coolers"] = {
    items: await CpuCoolers.find({}),
    query: (component: any) => component.name,
  };
  components.cases = {
    items: await Cases.find({}),
    query: (component: any) => component.name,
  };
  components["case-fans"] = {
    items: await CaseFan.find({}),
    query: (component: any) => component.name,
  };
  components["hard-drives"] = {
    items: await HardDrives.find({}),
    query: (component: any) => `${component.name} ${component.capacity}`,
  };
  components["power-supplies"] = {
    items: await PowerSupplies.find({}),
    query: (component: any) => `${component.name} ${component.wattage}`,
  };

  for (const key in components) {
    const component = components[key];
    await updateComponentData(component.items, component.query);
  }

  console.log("Finished updating price data for all components");
}
