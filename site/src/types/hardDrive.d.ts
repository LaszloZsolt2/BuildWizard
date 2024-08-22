import { ComponentBase } from "./componentBase";

export interface HardDrive extends ComponentBase {
  capacity: number;
  price_per_gb?: number;
  type: string | number;
  cache?: number;
  form_factor?: string | number;
  interface: string;
}
