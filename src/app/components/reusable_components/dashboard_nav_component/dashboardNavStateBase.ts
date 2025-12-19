import { computed, Signal, signal } from "@angular/core";
import { DashboardModeEnum } from "../../../config/enums/dashboardModeEnum";
import { PageEvent } from "@angular/material/paginator";

export abstract class DashboardNavStateBase<T> {

  // =====================
  // DATA
  // =====================
  items = signal<T[]>([]);
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
  // FORM MODE
  // =====================
  selectedItemId = signal<number | null>(null);
  formMode = signal<DashboardModeEnum>(DashboardModeEnum.CREATE);

  // =====================
  // MODE HELPERS
  // =====================
  isEditMode = computed(() => this.formMode() === DashboardModeEnum.EDIT);
  isViewMode = computed(() => this.formMode() === DashboardModeEnum.VIEW);

  // =====================
  // REQUEST PARAMS
  // =====================
  requestParams = computed(() => ({
    pageNumber: this.pageNumber(),
    pageSize: this.pageSize(),
    searchKey: this.searchText() || undefined
  }));

  // =====================
  // ABSTRACT HOOKS
  // =====================
  protected abstract getId(item: T): number | null;
  protected abstract loadItems(): void;
  protected abstract loadToForm(item: T, mode: DashboardModeEnum): void;
  protected abstract resetForm(): void;

  // =====================
  // COMMON HANDLERS
  // =====================
  view(item: T): void {
    this.loadToForm(item, DashboardModeEnum.VIEW);
  }

  edit(item: T): void {
    this.loadToForm(item, DashboardModeEnum.EDIT);
  }

  cancel(): void {
    this.resetForm();
  }

  onSearch(text: string): void {
    this.pageNumber.set(1);
    this.searchText.set(text);
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }
}