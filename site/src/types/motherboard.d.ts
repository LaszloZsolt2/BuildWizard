export interface Motherboard {
  _id: string;
  name: string;
  price?: number;
  socket: string;
  form_factor: string;
  max_memory: number;
  memory_slots: number;
  color: string;
}
