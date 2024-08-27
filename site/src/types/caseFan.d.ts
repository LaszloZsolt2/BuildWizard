import { ComponentBase } from "./componentBase";

export interface CaseFan extends ComponentBase {
  size: number;
  color: string;
  rpm?: number[];
  airflow?: number[];
  noise_level?: number[];
  pwm: boolean;
}
