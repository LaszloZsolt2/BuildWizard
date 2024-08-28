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

async function checkCpuRequirement(
  cpuId: string,
  benchmarks: any,
  requirementsMet: any
) {
  try {
    const cpu = await Cpus.findById(cpuId);
    if (cpu?.benchmark && cpu?.benchmark > -1) {
      if (cpu.benchmark >= benchmarks.minCpuBenchmark) {
        requirementsMet.minimum.cpu = true;
      }
      if (cpu.benchmark >= benchmarks.recCpuBenchmark) {
        requirementsMet.recommended.cpu = true;
      }
    }
  } catch (err) {
    console.error("Error finding CPU:", err);
  }
}

async function checkGpuRequirement(
  gpuId: string,
  benchmarks: any,
  requirementsMet: any,
  first: BenchmarkedSystemRequirement,
  second: BenchmarkedSystemRequirement
) {
  try {
    const gpu = await Gpus.findById(gpuId);
    if (gpu?.benchmark && gpu?.benchmark > -1) {
      if (gpu.benchmark >= benchmarks.minGpuBenchmark) {
        requirementsMet.minimum.gpu = true;
      }
      if (gpu.benchmark >= benchmarks.recGpuBenchmark) {
        requirementsMet.recommended.gpu = true;
      }
      if (
        gpu.memory >= first.systemRequirement.minimum.vram &&
        gpu.memory >= second.systemRequirement.minimum.vram
      ) {
        requirementsMet.minimum.vram = true;
      }
      if (
        gpu.memory >= first.systemRequirement.recommended.vram &&
        gpu.memory >= second.systemRequirement.recommended.vram
      ) {
        requirementsMet.recommended.vram = true;
      }
    }
  } catch (err) {
    console.error("Error finding GPU:", err);
  }
}

async function checkMemoryRequirement(
  memoryId: string,
  requirementsMet: any,
  first: BenchmarkedSystemRequirement,
  second: BenchmarkedSystemRequirement
) {
  try {
    const memory = await Memories.findById(memoryId);
    if (memory?.modules && memory?.modules.length === 2) {
      const totalRam = memory.modules[0] * memory.modules[1];
      if (
        totalRam >= first.systemRequirement.minimum.ram &&
        totalRam >= second.systemRequirement.minimum.ram
      ) {
        requirementsMet.minimum.ram = true;
      }
      if (
        totalRam >= first.systemRequirement.recommended.ram &&
        totalRam >= second.systemRequirement.recommended.ram
      ) {
        requirementsMet.recommended.ram = true;
      }
    }
  } catch (err) {
    console.error("Error finding memory:", err);
  }
}

async function checkHardDriveRequirement(
  hardDriveId: string,
  requirementsMet: any,
  first: BenchmarkedSystemRequirement,
  second: BenchmarkedSystemRequirement
) {
  try {
    const hardDrive = await HardDrives.findById(hardDriveId);
    if (
      hardDrive?.capacity &&
      hardDrive.capacity >=
        first.systemRequirement.space + second.systemRequirement.space
    ) {
      requirementsMet.space = true;
    }
  } catch (err) {
    console.error("Error finding hard drive:", err);
  }
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

  if (components.cpus) {
    await checkCpuRequirement(components.cpus._id, benchmarks, requirementsMet);
  }
  if (components.gpus) {
    await checkGpuRequirement(
      components.gpus._id,
      benchmarks,
      requirementsMet,
      first,
      second
    );
  }
  if (components.memories) {
    await checkMemoryRequirement(
      components.memories._id,
      requirementsMet,
      first,
      second
    );
  }
  if (components["hard-drives"]) {
    await checkHardDriveRequirement(
      components["hard-drives"]._id,
      requirementsMet,
      first,
      second
    );
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
