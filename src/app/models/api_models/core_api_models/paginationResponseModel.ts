export interface PaginationResponseModel<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}
