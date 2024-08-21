export interface PowerSupply {
  _id: string;
  name: string;
  price?: number;
  type: string;
  efficiency: string;
  wattage: number;
  modular?: string;
  color?: string;
}
