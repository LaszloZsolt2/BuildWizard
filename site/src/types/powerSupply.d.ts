import { ComponentBase } from "./componentBase";
export interface PowerSupply extends ComponentBase {
  type: string;
  efficiency: string;
  wattage: number;
  modular?: string;
  color?: string;
}
