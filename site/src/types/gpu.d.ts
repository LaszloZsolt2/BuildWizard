import { ComponentBase } from "./componentBase";

export interface Gpu extends ComponentBase {
  chipset: string;
  memory: number;
  core_clock: number;
  boost_clock: number;
  color: string;
  length: number;
  benchmark: number;
}
