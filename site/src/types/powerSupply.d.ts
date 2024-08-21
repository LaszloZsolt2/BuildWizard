import { ComponentBase } from "./componentBase";
export interface PowerSupply extends ComponentBase {
  price?: number;
  type: string;
  efficiency: string;
  wattage: number;
  modular?: string;
  color?: string;
}
