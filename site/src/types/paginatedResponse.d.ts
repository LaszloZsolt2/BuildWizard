import { ComponentBase } from "./componentBase";
export interface PaginatedResponse<T extends ComponentBase> {
  data: T[];
  total: number;
  page: number;
  limit?: number;
  totalPages: number;
}
