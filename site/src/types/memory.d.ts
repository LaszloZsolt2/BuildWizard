export interface Memory {
  _id: string;
  name: string;
  price?: number;
  speed: number[];
  modules: number[];
  price_per_gb?: number;
  color: string;
  first_word_latency: number;
  cas_latency: number;
}
