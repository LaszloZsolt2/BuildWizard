import mongoose from "mongoose";
import Cpus from "../models/Cpus";
import Gpus from "../models/Gpus";
import Memories from "../models/Memories";
import HardDrives from "../models/HardDrives";
import { BenchmarkedSystemRequirement, Benchmark } from "../types/benchmark";
import SystemRequirements from "../models/SystemRequirements";

export const MAX_CPU_BENCHMARK = 133;
export const MAX_GPU_BENCHMARK = 370;

export const storagePerformance = {
  "M.2 PCIe 5.0 X4": 100,
  "M.2 PCIe 4.0 X4": 90,
  "M.2 PCIe 3.0 X4": 80,
  "M.2 PCIe 5.0 X2": 85,
  "M.2 PCIe 4.0 X8": 95,
  "M.2 PCIe 3.0 X2": 70,
  "M.2 PCIe 2.0 X4": 60,
  "PCIe x16": 100,
  "PCIe x8": 85,
  "PCIe x4": 80,
  "PCIe x2": 70,
  "PCIe x1": 60,
  "SAS 12.0 Gb/s": 75,
  "SAS 6.0 Gb/s": 60,
  "SAS 3.0 Gb/s": 50,
  "SATA 6.0 Gb/s": 50,
  "SATA 3.0 Gb/s": 40,
  "SATA 1.5 Gb/s": 30,
  "M.2 SATA": 55,
  mSATA: 45,
  "U.2": 70,
  "PATA 100": 20,
  "PATA 44-Pin 100": 15,
};

export async function getBenchmark(
  component: string,
  componentModel: mongoose.Model<any>
): Promise<number> {
  let res;
  if (componentModel === Gpus) {
    res = await componentModel.findOne({ chipset: component });
  } else {
    res = await componentModel.findOne({ name: component });
  }
  return res?.benchmark || -1;
}

export async function getMinBenchmark(
  components: string[],
  componentModel: mongoose.Model<any>
): Promise<number> {
  if (!components || components.length === 0) {
    return -1;
  }
  let minBenchmark = Infinity;
  for (const component of components) {
    const benchmark = await getBenchmark(component, componentModel);
    if (benchmark === -1) {
      continue;
    }
    if (benchmark < minBenchmark) {
      minBenchmark = benchmark;
    }
  }
  return minBenchmark === Infinity ? -1 : minBenchmark;
}

export async function getSystemRequirementBenchmarks(
  systemRequirment: any
): Promise<Benchmark> {
  const minCpuBenchmark = await getMinBenchmark(
    systemRequirment.minimum.cpu,
    Cpus
  );
  const minGpuBenchmark = await getMinBenchmark(
    systemRequirment.minimum.gpu,
    Gpus
  );
  const recCpuBenchmark = await getMinBenchmark(
    systemRequirment.recommended.cpu,
    Cpus
  );
  const recGpuBenchmark = await getMinBenchmark(
    systemRequirment.recommended.gpu,
    Gpus
  );
  return {
    minCpuBenchmark,
    minGpuBenchmark,
    recCpuBenchmark,
    recGpuBenchmark,
  };
}

function compareBenchmarks(
  first: BenchmarkedSystemRequirement,
  second: BenchmarkedSystemRequirement
) {
  return {
    minCpuBenchmark: Math.max(
      first.benchmarks.minCpuBenchmark,
      second.benchmarks.minCpuBenchmark
    ),
    minGpuBenchmark: Math.max(
      first.benchmarks.minGpuBenchmark,
      second.benchmarks.minGpuBenchmark
    ),
    recCpuBenchmark: Math.max(
      first.benchmarks.recCpuBenchmark,
      second.benchmarks.recCpuBenchmark
    ),
    recGpuBenchmark: Math.max(
      first.benchmarks.recGpuBenchmark,
      second.benchmarks.recGpuBenchmark
    ),
  };
}

async function checkCpuRequirement(cpuId: string, benchmarks: any) {
  try {
    const cpu = await Cpus.findById(cpuId);
    if (cpu?.benchmark && cpu?.benchmark > -1) {
      return {
        minimum: cpu.benchmark >= benchmarks.minCpuBenchmark,
        recommended: cpu.benchmark >= benchmarks.recCpuBenchmark,
      };
    }
  } catch (err) {
    console.error("Error finding CPU:", err);
  }
  return {
    minimum: false,
    recommended: false,
  };
}

async function checkGpuRequirement(
  gpuId: string,
  benchmarks: any,
  first: BenchmarkedSystemRequirement,
  second: BenchmarkedSystemRequirement
) {
  try {
    const gpu = await Gpus.findById(gpuId);
    if (gpu?.benchmark && gpu?.benchmark > -1) {
      return {
        minimum: {
          gpu: gpu.benchmark >= benchmarks.minGpuBenchmark,
          vram:
            gpu.memory >= first.systemRequirement.minimum.vram &&
            gpu.memory >= second.systemRequirement.minimum.vram,
        },
        recommended: {
          gpu: gpu.benchmark >= benchmarks.recGpuBenchmark,
          vram:
            gpu.memory >= first.systemRequirement.recommended.vram &&
            gpu.memory >= second.systemRequirement.recommended.vram,
        },
      };
    }
  } catch (err) {
    console.error("Error finding GPU:", err);
  }
  return {
    minimum: { gpu: false, vram: false },
    recommended: { gpu: false, vram: false },
  };
}

async function checkMemoryRequirement(
  memories: any[],
  first: BenchmarkedSystemRequirement,
  second: BenchmarkedSystemRequirement
) {
  let totalRam = 0;
  for (const mem of memories) {
    try {
      const memory = await Memories.findById(mem._id);
      if (memory?.modules?.length === 2) {
        totalRam += memory.modules[0] * memory.modules[1];
      }
    } catch (err) {
      console.error("Error finding memory:", err);
    }
  }

  return {
    minimum:
      totalRam >= first.systemRequirement.minimum.ram &&
      totalRam >= second.systemRequirement.minimum.ram,
    recommended:
      totalRam >= first.systemRequirement.recommended.ram &&
      totalRam >= second.systemRequirement.recommended.ram,
  };
}

async function checkHardDriveRequirement(
  hardDrives: any[],
  first: BenchmarkedSystemRequirement,
  second: BenchmarkedSystemRequirement
) {
  let totalSpace = 0;
  for (const hd of hardDrives) {
    try {
      const hardDrive = await HardDrives.findById(hd._id);
      if (hardDrive?.capacity) {
        totalSpace += hardDrive.capacity;
      }
    } catch (err) {
      console.error("Error finding hard drive:", err);
    }
  }

  return (
    totalSpace >= first.systemRequirement.space + second.systemRequirement.space
  );
}

export async function combineSystemRequirements(
  first: BenchmarkedSystemRequirement,
  second?: BenchmarkedSystemRequirement,
  components?: any
): Promise<BenchmarkedSystemRequirement> {
  if (!second) {
    second = first;
  }

  const requirementsMet = {
    minimum: { cpu: false, gpu: false, ram: false, vram: false },
    recommended: { cpu: false, gpu: false, ram: false, vram: false },
    space: false,
  };

  const benchmarks = compareBenchmarks(first, second);

  if (components) {
    const promises = [];

    if (components.cpus) {
      promises.push(
        checkCpuRequirement(components.cpus._id, benchmarks).then((met) => {
          requirementsMet.minimum.cpu = met.minimum;
          requirementsMet.recommended.cpu = met.recommended;
        })
      );
    }

    if (components.gpus) {
      promises.push(
        checkGpuRequirement(
          components.gpus._id,
          benchmarks,
          first,
          second
        ).then((met) => {
          requirementsMet.minimum.gpu = met.minimum.gpu;
          requirementsMet.recommended.gpu = met.recommended.gpu;
          requirementsMet.minimum.vram = met.minimum.vram;
          requirementsMet.recommended.vram = met.recommended.vram;
        })
      );
    }

    if (components.memories) {
      promises.push(
        checkMemoryRequirement(components.memories, first, second).then(
          (met) => {
            requirementsMet.minimum.ram = met.minimum;
            requirementsMet.recommended.ram = met.recommended;
          }
        )
      );
    }

    if (components["hard-drives"]) {
      promises.push(
        checkHardDriveRequirement(
          components["hard-drives"],
          first,
          second
        ).then((met) => {
          requirementsMet.space = met;
        })
      );
    }

    await Promise.all(promises);
  }

  return {
    systemRequirement: {
      minimum: {
        cpu:
          first.benchmarks.minCpuBenchmark > second.benchmarks.minCpuBenchmark
            ? first.systemRequirement.minimum.cpu
            : second.systemRequirement.minimum.cpu,
        gpu:
          first.benchmarks.minGpuBenchmark > second.benchmarks.minGpuBenchmark
            ? first.systemRequirement.minimum.gpu
            : second.systemRequirement.minimum.gpu,
        ram: Math.max(
          first.systemRequirement.minimum.ram,
          second.systemRequirement.minimum.ram
        ),
        vram: Math.max(
          first.systemRequirement.minimum.vram,
          second.systemRequirement.minimum.vram
        ),
      },
      recommended: {
        cpu:
          first.benchmarks.recCpuBenchmark > second.benchmarks.recCpuBenchmark
            ? first.systemRequirement.recommended.cpu
            : second.systemRequirement.recommended.cpu,
        gpu:
          first.benchmarks.recGpuBenchmark > second.benchmarks.recGpuBenchmark
            ? first.systemRequirement.recommended.gpu
            : second.systemRequirement.recommended.gpu,
        ram: Math.max(
          first.systemRequirement.recommended.ram,
          second.systemRequirement.recommended.ram
        ),
        vram: Math.max(
          first.systemRequirement.recommended.vram,
          second.systemRequirement.recommended.vram
        ),
      },
      space: first.systemRequirement.space + second.systemRequirement.space,
    },
    benchmarks,
    requirementsMet,
  };
}

export async function getCombinedSystemRequirements(req: any) {
  let combinedSystemRequirements: BenchmarkedSystemRequirement | undefined;
  for (const id of req.query.ids as string[]) {
    const systemRequirement = await SystemRequirements.findById(id);
    if (systemRequirement) {
      const benchmarks =
        await getSystemRequirementBenchmarks(systemRequirement);
      combinedSystemRequirements = await combineSystemRequirements(
        { systemRequirement, benchmarks },
        combinedSystemRequirements,
        req.query.components
      );
    }
  }

  return combinedSystemRequirements;
}
