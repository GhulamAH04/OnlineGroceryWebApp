// interfaces/pagination.ts

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}
