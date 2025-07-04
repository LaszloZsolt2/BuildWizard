import { ComponentBase } from "./componentBase";
export interface Memory extends ComponentBase {
  speed: number[];
  modules: number[];
  price_per_gb?: number;
  color: string;
  first_word_latency: number;
  cas_latency: number;
}
