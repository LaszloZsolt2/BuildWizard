import { ComponentBase } from "./componentBase";

export interface CpuCooler extends ComponentBase {
  price?: number;
  rpm: number[];
  noise_level: number[];
  size?: number;
}
