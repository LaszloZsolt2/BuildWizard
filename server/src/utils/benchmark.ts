import mongoose from "mongoose";
import Cpus from "../models/Cpus";
import Gpus from "../models/Gpus";
import Memories from "../models/Memories";
import HardDrives from "../models/HardDrives";
import { BenchmarkedSystemRequirement, Benchmark } from "../types/benchmark";

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
    if (components.cpus) {
      const met = await checkCpuRequirement(components.cpus._id, benchmarks);
      requirementsMet.minimum.cpu = met.minimum;
      requirementsMet.recommended.cpu = met.recommended;
    }
    if (components.gpus) {
      const met = await checkGpuRequirement(
        components.gpus._id,
        benchmarks,
        first,
        second
      );
      requirementsMet.minimum.gpu = met.minimum.gpu;
      requirementsMet.recommended.gpu = met.recommended.gpu;
      requirementsMet.minimum.vram = met.minimum.vram;
      requirementsMet.recommended.vram = met.recommended.vram;
    }
    if (components.memories) {
      const met = await checkMemoryRequirement(
        components.memories,
        first,
        second
      );
      requirementsMet.minimum.ram = met.minimum;
      requirementsMet.recommended.ram = met.recommended;
    }
    if (components["hard-drives"]) {
      const met = await checkHardDriveRequirement(
        components["hard-drives"],
        first,
        second
      );
      requirementsMet.space = met;
    }
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
