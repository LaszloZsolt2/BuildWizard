import { ComponentBase } from "./componentBase";
export interface Motherboard extends ComponentBase {
  price?: number;
  socket: string;
  form_factor: string;
  max_memory: number;
  memory_slots: number;
  color: string;
}
