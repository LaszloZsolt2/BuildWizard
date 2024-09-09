import { ComponentBase } from "./componentBase";

export interface CpuCooler extends ComponentBase {
  rpm: number[];
  noise_level: number[];
  size?: number;
  tdp?: number;
}
