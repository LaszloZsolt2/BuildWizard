export interface Cpu {
  _id: string;
  name: string;
  price?: number;
  core_count: number;
  core_clock: number;
  tdp: number;
  graphics?: string;
  smt: boolean;
  benchmark: number;
  socket: string;
}
