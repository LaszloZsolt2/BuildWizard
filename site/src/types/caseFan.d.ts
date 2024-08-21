export interface CaseFan {
  _id: string;
  name: string;
  price?: number;
  size: number;
  color: string;
  rpm?: number[];
  airflow?: number[];
  noise_level?: number[];
  pwm: boolean;
}
