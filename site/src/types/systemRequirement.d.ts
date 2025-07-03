interface Requirement {
  cpu: string[];
  ram: number;
  gpu: string[];
  vram: number;
}
import { ComponentBase } from "./componentBase";
export interface SystemRequirement extends ComponentBase {
  type: "game" | "software";
  minimum: Requirement;
  recommended: Requirement;
  space: number;
}
