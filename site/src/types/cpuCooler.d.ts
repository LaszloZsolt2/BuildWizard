export interface CpuCooler {
  _id: string;
  name: string;
  price?: number;
  rpm: number[];
  noise_level: number[];
  size?: number;
}
