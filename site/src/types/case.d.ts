export interface Case {
  _id: string;
  name: string;
  price?: number;
  type: string;
  color: string;
  psu?: number;
  side_panel?: string;
  external_volume?: number;
  internal_35_bays: number;
}
