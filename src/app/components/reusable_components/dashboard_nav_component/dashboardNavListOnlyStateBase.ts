import { computed, Signal, signal } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";

export abstract class DashboardNavListOnlyStateBase<TRead> {

    // =====================
    // DATA
    // =====================
    items = signal<TRead[]>([]);
    loading!: Signal<boolean>;

    // =====================
    // PAGINATION
    // =====================
    pageNumber = signal(1);
    pageSize = signal(10);
    totalCount = signal(0);

    // =====================
    // SEARCH
    // =====================
    searchText = signal('');

    // =====================
    // REQUEST PARAMS
    // =====================
    protected getSearchKey(): string | undefined {
        return this.searchText() || undefined;
    }

    requestParams = computed(() => ({
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
        searchKey: this.getSearchKey()
    }));

    // =====================
    // ABSTRACT
    // =====================
    protected abstract loadItems(): void;

    // =====================
    // COMMON HANDLERS
    // =====================
    onSearch(text: string): void {
        this.pageNumber.set(1);
        this.searchText.set(text);
    }

    onPageChange(event: PageEvent): void {
        this.pageNumber.set(event.pageIndex + 1);
        this.pageSize.set(event.pageSize);
    }
}