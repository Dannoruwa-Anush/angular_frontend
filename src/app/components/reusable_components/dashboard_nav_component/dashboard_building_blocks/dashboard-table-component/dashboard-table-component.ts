import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { PageEvent } from '@angular/material/paginator';
import { DashboardTableColumnModel } from '../../../../../models/ui_models/dashboardTableColumnModel';

@Component({
  selector: 'app-dashboard-table-component',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './dashboard-table-component.html',
  styleUrl: './dashboard-table-component.scss',
})
export class DashboardTableComponent<T> {



  // ===== DATA =====
  @Input({ required: true }) data: T[] = [];
  @Input({ required: true }) columns: DashboardTableColumnModel<T>[] = [];

  // ===== SEARCH =====
  @Input() searchLabel = 'Search';
  @Input() searchValue = '';
  @Input() disableSearch = false;
  @Output() searchChange = new EventEmitter<string>();

  // ===== PAGINATION =====
  @Input() totalCount = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25];
  @Input() pageIndex = 0;
  @Output() pageChange = new EventEmitter<PageEvent>();

  // ===== ACTION TEMPLATE =====
  @ContentChild(TemplateRef) actionsTemplate?: TemplateRef<any>;

  @Input() showActions = true;
  @Input() showRowNumber = true;

  get columnKeys(): string[] {
    const keys: string[] = [];

    if (this.showRowNumber) {
      keys.push('rowNumber');
    }

    keys.push(...this.columns.map(c => c.key));
    
    if (this.showActions && this.actionsTemplate) {
      keys.push('actions');
    }

    return keys;
  }

  getRowNumber(rowIndex: number): number {
    return this.pageIndex * this.pageSize + rowIndex + 1;
  }
}
