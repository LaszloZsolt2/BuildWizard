import { ComponentBase } from "./componentBase";

export interface Cpu extends ComponentBase {
  core_count: number;
  core_clock: number;
  tdp: number;
  graphics?: string;
  smt: boolean;
  benchmark: number;
  socket: string;
}
