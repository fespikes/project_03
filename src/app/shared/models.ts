export interface Pagination {
  page: number;
  size: number;
  total: number;
}

export interface PartialCollection {
  data: any[];
  pagination: Pagination;
}
