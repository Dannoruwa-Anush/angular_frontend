import { Directive } from "@angular/core";

import { DashboardModeEnum } from "../../../config/enums/dashboardModeEnum";

@Directive()
export abstract class BaseDashboardDirective<T> {

  /** LIST */
  items: T[] = [];
  selectedItem: T | null = null;

  /** MODE */
  mode: DashboardModeEnum = DashboardModeEnum.CREATE;
  DashboardMode = DashboardModeEnum; // template access

  /** PAGINATION */
  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;

  /** SEARCH */
  searchKey = '';

  /** UI */
  loading = false;

  /* ------------------ MODE HANDLERS ------------------ */

  setCreateMode(): void {
    this.mode = DashboardModeEnum.CREATE;
    this.selectedItem = null;
    this.resetForm();
  }

  setViewMode(item: T): void {
    this.mode = DashboardModeEnum.VIEW;
    this.selectedItem = item;
    this.loadToForm(item);
  }

  setEditMode(item: T): void {
    this.mode = DashboardModeEnum.EDIT;
    this.selectedItem = item;
    this.loadToForm(item);
  }

  /* ------------------ ABSTRACT CONTRACT ------------------ */

  abstract loadItems(): void;
  abstract save(): void;
  abstract update(): void;
  abstract delete(item: T): void;
  abstract loadToForm(item: T): void;
  abstract resetForm(): void;
}