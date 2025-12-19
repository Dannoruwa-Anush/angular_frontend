export interface DashboardTableColumnModel<T> {
    key: string;
    header: string;
    cell: (row: T) => string | number | null;
}
