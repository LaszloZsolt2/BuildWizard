export interface HardDrive {
  _id: string;
  name: string;
  price?: number;
  capacity: number;
  price_per_gb?: number;
  type: string | number;
  cache?: number;
  form_factor?: string | number;
  interface: string;
}
