import CaseFans from "../models/CaseFans";
import Cases from "../models/Cases";
import CpuCoolers from "../models/CpuCoolers";
import Cpus from "../models/Cpus";
import Gpus from "../models/Gpus";
import HardDrives from "../models/HardDrives";
import Memories from "../models/Memories";
import Motherboards from "../models/Motherboards";
import PowerSupplies from "../models/PowerSupplies";

export const partModels = {
  "cpu-coolers": CpuCoolers,
  "hard-drives": HardDrives,
  memories: Memories,
  cpus: Cpus,
  gpus: Gpus,
  cases: Cases,
  "case-fans": CaseFans,
  motherboards: Motherboards,
  "power-supplies": PowerSupplies,
};
