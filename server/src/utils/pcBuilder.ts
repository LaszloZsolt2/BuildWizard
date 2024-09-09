import { BenchmarkedSystemRequirement } from "../types/benchmark";
import { ComponentsType } from "../types/componentsType";
import { PartType } from "../types/partType";
import {
  MAX_CPU_BENCHMARK,
  MAX_GPU_BENCHMARK,
  storagePerformance,
} from "./benchmark";
import {
  caseMotherboardCompatibility,
  casePowerSupplyCompatibility,
  socketRamSpeeds,
} from "./compatibilityChecks";
import { componentQuantity } from "./componentQuantity";

export type BuildType = {
  systemRequirements: "minimum" | "recommended";
  multiplier?: number;
};

export function buildPc(
  systemRequirements: BenchmarkedSystemRequirement,
  allParts: ComponentsType,
  requiredParts: ComponentsType,
  type: BuildType,
  multiplier?: number,
  extraBudget?: number
) {
  function chooseCpu() {
    let cpuBenchmark =
      type.systemRequirements === "minimum"
        ? systemRequirements.benchmarks.minCpuBenchmark
        : systemRequirements.benchmarks.recCpuBenchmark;

    if (multiplier && multiplier > 1) {
      cpuBenchmark = Math.min(
        MAX_CPU_BENCHMARK,
        cpuBenchmark * Math.sqrt(multiplier)
      );
    }

    if (requiredParts.cpus) {
      return requiredParts.cpus.benchmark >= cpuBenchmark
        ? requiredParts.cpus
        : null;
    } else {
      let cpus = allParts.cpus.filter(
        (cpu: any) => cpu.benchmark >= cpuBenchmark
      );

      if (requiredParts.motherboards) {
        cpus = cpus.filter((cpu: any) => {
          return requiredParts.motherboards.socket === cpu.socket;
        });
      }

      if (requiredParts.memories) {
        if (!requiredParts.memories[0].speed) {
          return null;
        }

        const memoryType = requiredParts.memories[0].speed[0];
        cpus = cpus.filter((cpu: any) => {
          return (
            socketRamSpeeds[cpu.socket as keyof typeof socketRamSpeeds] ===
            memoryType
          );
        });
      }

      if (requiredParts["cpu-coolers"]) {
        cpus = cpus.filter((cpu: any) => {
          return cpu.tdp <= requiredParts["cpu-coolers"].tdp;
        });
      }

      if (!cpus.length) {
        return null;
      }

      const preferredCpus = cpus
        .filter(
          (cpu: any) =>
            cpu.price_data &&
            socketRamSpeeds[cpu.socket as keyof typeof socketRamSpeeds] > 3 // prefer ddr4 or newer since we don't have prices for older components
        )
        .sort(
          (a: any, b: any) => a.price_data[0].price - b.price_data[0].price
        );

      return preferredCpus.length ? preferredCpus[0] : cpus[0];
    }
  }

  function chooseMotherboard() {
    const cpu = build.cpus;
    if (!cpu) {
      return null;
    }

    if (requiredParts.motherboards) {
      return requiredParts.motherboards;
    }

    let motherboards = allParts.motherboards.filter(
      (mb: any) => mb.socket === cpu.socket
    );

    if (requiredParts.cases) {
      const caseType = requiredParts.cases
        .type as keyof typeof caseMotherboardCompatibility;
      motherboards = motherboards.filter((mb: any) => {
        return caseMotherboardCompatibility[caseType].includes(mb.form_factor);
      });
    }

    if (requiredParts.memories) {
      if (!requiredParts.memories[0].speed) {
        return null;
      }

      const memoryType = requiredParts.memories[0].speed[0];
      motherboards = motherboards.filter(
        (mb: any) =>
          socketRamSpeeds[mb.socket as keyof typeof socketRamSpeeds] ===
          memoryType
      );
    }

    if (!motherboards.length) {
      return null;
    }

    const preferredMotherboards = motherboards
      .filter((mb: any) => mb.price_data)
      .sort((a: any, b: any) => a.price_data[0].price - b.price_data[0].price);

    if (extraBudget && preferredMotherboards.length) {
      const basePrice = preferredMotherboards[0].price_data[0].price;
      const budget = basePrice + extraBudget / remainingParts;
      const extraBudgetMotherboards = motherboards
        .filter((mb: any) => {
          return mb.price_data && mb.price_data[0].price <= budget;
        })
        .sort(
          (a: any, b: any) => b.price_data[0].price - a.price_data[0].price
        );

      if (extraBudgetMotherboards.length) {
        extraBudget -=
          extraBudgetMotherboards[0].price_data[0].price - basePrice;

        return extraBudgetMotherboards[0];
      }
    }

    return preferredMotherboards.length
      ? preferredMotherboards[0]
      : motherboards[0];
  }

  function chooseMemory() {
    const MAX_MEMORY_PERFORMANCE = 450;

    function calculateMemoryPerformance(memory: any) {
      const type = memory.speed[0] || 2;
      const speed = memory.speed[1] || 0;
      const numberOfModules = memory.modules[0] || 0;
      const moduleSize = memory.modules[1] || 0;
      const firstWordLatency = memory.first_word_latency || 20;
      const casLatency = memory.cas_latency || 36;
      const totalMemory = numberOfModules * moduleSize;
      const channelMultiplier = numberOfModules > 1 ? 1.2 : 1;

      return (
        (type * Math.sqrt(speed) * totalMemory ** 0.8 * channelMultiplier) /
        (firstWordLatency ** 0.7 + casLatency ** 0.7)
      );
    }

    function getBaselinePerformance(totalSize: number) {
      return totalSize * 10;
    }

    if (requiredParts.memories) {
      return requiredParts.memories;
    }

    if (!build.motherboards) {
      return null;
    }

    const motherboard = build.motherboards;
    if (!motherboard) {
      return null;
    }

    const memoryType =
      socketRamSpeeds[motherboard.socket as keyof typeof socketRamSpeeds];
    const memoryAmount =
      type.systemRequirements === "minimum"
        ? systemRequirements.systemRequirement.minimum.ram
        : systemRequirements.systemRequirement.recommended.ram;
    let minPerformance = 0;
    if (multiplier && multiplier > 1) {
      const baseline = getBaselinePerformance(memoryAmount);
      minPerformance = Math.min(MAX_MEMORY_PERFORMANCE, baseline * multiplier);
    }

    const memories = allParts.memories.filter((memory: any) => {
      return (
        memory.speed[0] === memoryType &&
        memory.modules &&
        memory.modules[0] * memory.modules[1] >= memoryAmount &&
        memory.modules[0] <= motherboard.memory_slots &&
        memory.modules[0] * memory.modules[1] <= motherboard.max_memory &&
        calculateMemoryPerformance(memory) >= minPerformance
      );
    });

    if (!memories.length) {
      return null;
    }

    const preferredMemories = memories
      .filter((memory: any) => memory.price_data)
      .sort((a: any, b: any) => a.price_data[0].price - b.price_data[0].price);

    if (extraBudget && preferredMemories.length) {
      const basePrice = preferredMemories[0].price_data[0].price;
      const budget = basePrice + extraBudget / remainingParts;
      const extraBudgetMemories = memories
        .filter((memory: any) => {
          return memory.price_data && memory.price_data[0].price <= budget;
        })
        .sort((a: any, b: any) => {
          if (calculateMemoryPerformance(a) !== calculateMemoryPerformance(b)) {
            return (
              calculateMemoryPerformance(b) - calculateMemoryPerformance(a)
            );
          }
          return b.price_data[0].price - a.price_data[0].price;
        });

      if (extraBudgetMemories.length) {
        extraBudget -= extraBudgetMemories[0].price_data[0].price - basePrice;
        return [extraBudgetMemories[0]];
      }
    }

    return [preferredMemories.length ? preferredMemories[0] : memories[0]];
  }

  function chooseGpu() {
    if (requiredParts.gpus) {
      return requiredParts.gpus;
    }

    if (!build.cpus) {
      return null;
    }

    let gpuBenchmark =
      type.systemRequirements === "minimum"
        ? systemRequirements.benchmarks.minGpuBenchmark
        : systemRequirements.benchmarks.recGpuBenchmark;

    const vramAmount =
      type.systemRequirements === "minimum"
        ? systemRequirements.systemRequirement.minimum.vram
        : systemRequirements.systemRequirement.recommended.vram;

    if (multiplier && multiplier > 1) {
      gpuBenchmark = Math.min(MAX_GPU_BENCHMARK, gpuBenchmark * multiplier);
    }

    const gpus = allParts.gpus.filter(
      (gpu: any) => gpu.benchmark >= gpuBenchmark && gpu.memory >= vramAmount
    );

    const isGpuOptional = gpuBenchmark <= 0 && build.cpus.graphics;

    if (!gpus.length || (isGpuOptional && !extraBudget)) {
      return null;
    }

    const preferredGpus = gpus
      .filter((gpu: any) => gpu.price_data)
      .sort((a: any, b: any) => a.price_data[0].price - b.price_data[0].price);

    if (extraBudget && preferredGpus.length) {
      const basePrice =
        isGpuOptional && extraBudget ? 0 : preferredGpus[0].price_data[0].price;
      const budget = basePrice + extraBudget / remainingParts;
      const extraBudgetGpus = gpus
        .filter((gpu: any) => {
          return gpu.price_data && gpu.price_data[0].price <= budget;
        })
        .sort((a: any, b: any) => {
          if (a.benchmark !== b.benchmark) {
            return b.benchmark - a.benchmark;
          }
          return b.price_data[0].price - a.price_data[0].price;
        });

      if (extraBudgetGpus.length) {
        extraBudget -= extraBudgetGpus[0].price_data[0].price - basePrice;
        return extraBudgetGpus[0];
      }
    }

    if (isGpuOptional) {
      return null;
    }

    return preferredGpus.length ? preferredGpus[0] : gpus[0];
  }

  function chooseCpuCooler() {
    if (requiredParts["cpu-coolers"]) {
      return requiredParts["cpu-coolers"];
    }

    const cpuCoolers = allParts["cpu-coolers"].filter(
      (cooler: any) => (cooler.tdp || 0) >= (build.cpus.tdp || 0) * 1.5
    );

    if (!cpuCoolers.length) {
      return null;
    }

    const preferredCoolers = cpuCoolers
      .filter((cooler: any) => cooler.price_data)
      .sort((a: any, b: any) => a.price_data[0].price - b.price_data[0].price);

    if (extraBudget && preferredCoolers.length) {
      const basePrice = preferredCoolers[0].price_data[0].price;
      const budget = basePrice + extraBudget / remainingParts;
      const extraBudgetCoolers = cpuCoolers
        .filter((cooler: any) => {
          return cooler.price_data && cooler.price_data[0].price <= budget;
        })
        .sort((a: any, b: any) => {
          return b.price_data[0].price - a.price_data[0].price;
        });

      if (extraBudgetCoolers.length) {
        extraBudget -= extraBudgetCoolers[0].price_data[0].price - basePrice;
        return extraBudgetCoolers[0];
      }
    }

    return preferredCoolers.length ? preferredCoolers[0] : cpuCoolers[0];
  }

  function chooseStorage() {
    function calculateStoragePerformance(storage: any) {
      const storageInterface =
        storage.interface as keyof typeof storagePerformance;
      return (
        storage.capacity * Math.log2(storagePerformance[storageInterface] ** 2)
      );
    }

    function getBaselinePerformance(storageAmount: number) {
      return calculateStoragePerformance({
        capacity: storageAmount,
        interface: "SATA 6.0 Gb/s",
      });
    }

    if (requiredParts["hard-drives"]) {
      return requiredParts["hard-drives"];
    }

    let hardDrives = allParts["hard-drives"];
    const storageAmount = systemRequirements.systemRequirement.space;

    // if it is a minimum requirement build, use a hdd, otherwise use an ssd
    if (type.systemRequirements === "recommended") {
      hardDrives = hardDrives.filter((hd: any) => {
        return hd.type === "SSD";
      });
    }

    let storagePerformanceScore = 0;
    if (multiplier && multiplier > 1) {
      storagePerformanceScore =
        getBaselinePerformance(storageAmount) * multiplier;
    }

    hardDrives = hardDrives.filter((hd: any) => {
      return (
        hd.capacity >= storageAmount &&
        calculateStoragePerformance(hd) >= storagePerformanceScore
      );
    });

    if (!hardDrives.length) {
      return null;
    }

    const preferredDrives = hardDrives
      .filter((hd: any) => hd.price_data && hd.price_data[0])
      .sort((a: any, b: any) => a.price_data[0].price - b.price_data[0].price);

    if (extraBudget && preferredDrives.length) {
      const basePrice = preferredDrives[0].price_data[0].price;
      const budget = basePrice + extraBudget / remainingParts;
      const extraBudgetDrives = hardDrives
        .filter((hd: any) => {
          return hd.price_data && hd.price_data[0]?.price <= budget;
        })
        .sort((a: any, b: any) => {
          if (
            calculateStoragePerformance(a) !== calculateStoragePerformance(b)
          ) {
            return (
              calculateStoragePerformance(b) - calculateStoragePerformance(a)
            );
          }
          return b.price_data[0].price - a.price_data[0].price;
        });

      if (extraBudgetDrives.length) {
        extraBudget -= extraBudgetDrives[0].price_data[0].price - basePrice;
        return [extraBudgetDrives[0]];
      }
    }

    return [preferredDrives.length ? preferredDrives[0] : hardDrives[0]];
  }

  function chooseCase() {
    if (requiredParts.cases) {
      return requiredParts.cases;
    }

    if (!build.motherboards) {
      return null;
    }

    let cases = allParts.cases;

    cases = cases.filter((c: any) => {
      const caseType = c.type as keyof typeof caseMotherboardCompatibility;
      return caseMotherboardCompatibility[caseType].includes(
        build.motherboards.form_factor
      );
    });

    if (requiredParts["power-supplies"]) {
      cases = cases.filter((c: any) => {
        const caseType = c.type as keyof typeof casePowerSupplyCompatibility;
        return casePowerSupplyCompatibility[caseType].includes(
          requiredParts["power-supplies"].type
        );
      });
    }

    let bayCount = 0;
    if (build["hard-drives"]) {
      for (const drive of build["hard-drives"]) {
        bayCount +=
          drive.form_factor == 2.5 || drive.form_factor == 3.5 ? 1 : 0;
      }
    }

    cases = cases.filter((c: any) => {
      return c.internal_35_bays >= bayCount;
    });

    if (!cases.length) {
      return null;
    }

    const preferredCases = cases
      .filter((c: any) => c.price_data)
      .sort((a: any, b: any) => a.price_data[0].price - b.price_data[0].price);

    if (extraBudget && preferredCases.length) {
      const basePrice = preferredCases[0].price_data[0].price;
      const budget = basePrice + extraBudget / remainingParts;
      const extraBudgetCases = cases
        .filter((c: any) => {
          return c.price_data && c.price_data[0].price <= budget;
        })
        .sort((a: any, b: any) => {
          return b.price_data[0].price - a.price_data[0].price;
        });

      if (extraBudgetCases.length) {
        extraBudget -= extraBudgetCases[0].price_data[0].price - basePrice;
        return extraBudgetCases[0];
      }
    }

    return preferredCases.length ? preferredCases[0] : cases[0];
  }

  function choosePowerSupply() {
    if (requiredParts["power-supplies"]) {
      return requiredParts["power-supplies"];
    }

    if (!build.cases) {
      return null;
    }

    let powerSupplies = allParts["power-supplies"];

    const caseType = build.cases
      .type as keyof typeof casePowerSupplyCompatibility;
    powerSupplies = powerSupplies.filter((ps: any) => {
      return casePowerSupplyCompatibility[caseType].includes(ps.type);
    });

    if (!powerSupplies.length) {
      return null;
    }

    const preferredPowerSupplies = powerSupplies
      .filter((ps: any) => ps.price_data)
      .sort((a: any, b: any) => a.price_data[0].price - b.price_data[0].price);

    if (extraBudget && preferredPowerSupplies.length) {
      const basePrice = preferredPowerSupplies[0].price_data[0].price;
      const budget = basePrice + extraBudget / remainingParts;
      const extraBudgetPowerSupplies = powerSupplies
        .filter((ps: any) => {
          return ps.price_data && ps.price_data[0].price <= budget;
        })
        .sort((a: any, b: any) => {
          return b.price_data[0].price - a.price_data[0].price;
        });

      if (extraBudgetPowerSupplies.length) {
        extraBudget -=
          extraBudgetPowerSupplies[0].price_data[0].price - basePrice;
        return extraBudgetPowerSupplies[0];
      }
    }

    return preferredPowerSupplies.length
      ? preferredPowerSupplies[0]
      : powerSupplies[0];
  }

  function chooseCaseFans() {
    if (extraBudget) {
      const budget = extraBudget / remainingParts;
      const caseFans = allParts["case-fans"]
        .filter((cf: any) => {
          return cf.price_data && cf.price_data[0].price <= budget;
        })
        .sort((a: any, b: any) => {
          return b.price_data[0].price - a.price_data[0].price;
        });

      if (caseFans.length) {
        extraBudget -= caseFans[0].price_data[0].price;
        return [caseFans[0]];
      }
    }

    return [];
  }

  let remainingParts = 9;
  let build: ComponentsType = {};

  const partsSelection = {
    cpus: chooseCpu,
    motherboards: chooseMotherboard,
    memories: chooseMemory,
    gpus: chooseGpu,
    "cpu-coolers": chooseCpuCooler,
    "hard-drives": chooseStorage,
    cases: chooseCase,
    "power-supplies": choosePowerSupply,
    "case-fans": chooseCaseFans,
  };

  Object.keys(partsSelection).forEach((p) => {
    const part = p as PartType;
    build[part] = partsSelection[part]();
    remainingParts--;
  });

  if (
    !build.cpus ||
    !build.motherboards ||
    !build.memories ||
    !build["cpu-coolers"] ||
    !build["hard-drives"] ||
    !build.cases
  ) {
    return null;
  }

  return build;
}

export function getBuildPrice(build: ComponentsType | null) {
  if (!build) {
    return { price: 0, isPriceForAllParts: false };
  }

  let price = 0;
  let isPriceForAllParts = true;

  for (const k in build) {
    const key = k as PartType;
    if (componentQuantity[key] === "multiple") {
      price += build[key].reduce((acc: number, part: any) => {
        if (!part?.price_data) {
          isPriceForAllParts = false;
          return acc;
        }
        return acc + part.price_data[0].price;
      }, 0);
    } else {
      if (!build[key]?.price_data) {
        isPriceForAllParts = false;
      } else {
        price += build[key].price_data[0].price;
      }
    }
  }

  return { price, isPriceForAllParts };
}

export function buildWithExtraBudget(
  budget: number,
  oldPc: ComponentsType,
  multiplier: number,
  systemRequirements: BenchmarkedSystemRequirement,
  allParts: ComponentsType,
  requiredParts: ComponentsType,
  buildType: "minimum" | "recommended"
) {
  const extraBudget = budget - getBuildPrice(oldPc!).price;

  let pcWithExtraBudget = buildPc(
    systemRequirements,
    allParts,
    requiredParts || {},
    {
      systemRequirements: buildType,
    },
    multiplier,
    extraBudget
  );

  if (!pcWithExtraBudget || getBuildPrice(pcWithExtraBudget).price > budget) {
    pcWithExtraBudget = buildPc(
      systemRequirements,
      allParts,
      requiredParts || {},
      {
        systemRequirements: buildType,
      },
      multiplier,
      extraBudget / 2
    );
  }

  return pcWithExtraBudget && getBuildPrice(pcWithExtraBudget).price <= budget
    ? pcWithExtraBudget
    : oldPc;
}
