import mongoose from "mongoose";
import Cpus from "../models/Cpus";
import Gpus from "../models/Gpus";

export type Benchmark = {
  minCpuBenchmark: number;
  minGpuBenchmark: number;
  recCpuBenchmark: number;
  recGpuBenchmark: number;
};

export type BenchmarkedSystemRequirement = {
  systemRequirement: any;
  benchmarks: Benchmark;
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

export function combineSystemRequirements(
  first: BenchmarkedSystemRequirement,
  second?: BenchmarkedSystemRequirement
): BenchmarkedSystemRequirement {
  if (!second) {
    return first;
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
    benchmarks: {
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
    },
  };
}
