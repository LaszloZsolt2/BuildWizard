export type Benchmark = {
  minCpuBenchmark: number;
  minGpuBenchmark: number;
  recCpuBenchmark: number;
  recGpuBenchmark: number;
};

export type requirementsMet = {
  minimum: {
    cpu: boolean;
    gpu: boolean;
    ram: boolean;
    vram: boolean;
  };
  recommended: {
    cpu: boolean;
    gpu: boolean;
    ram: boolean;
    vram: boolean;
  };
  space: boolean;
};

export type BenchmarkedSystemRequirement = {
  systemRequirement: any;
  benchmarks: Benchmark;
  requirementsMet?: requirementsMet;
};
