interface Requirement {
  cpu: string[];
  ram: number;
  gpu: string[];
  vram: number;
}

export interface SystemRequirement {
  _id: string;
  name: string;
  type: "game" | "software";
  minimum: Requirement;
  recommended: Requirement;
  space: number;
}
