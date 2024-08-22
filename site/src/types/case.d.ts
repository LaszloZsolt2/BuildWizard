import { ComponentBase } from "./componentBase";

export interface Case extends ComponentBase {
  type: string;
  color: string;
  psu?: number;
  side_panel?: string;
  external_volume?: number;
  internal_35_bays: number;
}
