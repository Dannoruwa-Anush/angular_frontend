import { Component, computed, effect, signal } from '@angular/core';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { CommonModule } from '@angular/common';
import { DashboardTableComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-table-component/dashboard-table-component';
import { CashflowReadModel } from '../../../../../models/api_models/read_models/cashflow_read_model';
import { DashboardNavListOnlyStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavListOnlyStateBase';
import { CashflowStatusUiModel } from '../../../../../models/ui_models/cashflowStatusUiModel';
import { CashflowStatusEnum } from '../../../../../config/enums/cashflowStatusEnum';
import { DashboardTableColumnModel } from '../../../../../models/ui_models/dashboardTableColumnModel';
import { CashflowService } from '../../../../../services/api_services/cashflowService';

@Component({
  selector: 'app-cashflow-nav-component',
  imports: [
    MaterialModule,
    CommonModule,
    DashboardTableComponent
  ],
  templateUrl: './cashflow-nav-component.html',
  styleUrl: './cashflow-nav-component.scss',
})
export class CashflowNavComponent extends DashboardNavListOnlyStateBase<CashflowReadModel> {




  cashflowStatuses = signal<CashflowStatusUiModel[]>([]);
  selectedCashflowStatusId = signal<number | undefined>(undefined);

  selectedCashflowName = computed(() => {
    const id = this.selectedCashflowStatusId();
    return id ? CashflowStatusEnum[id] : undefined;
  });

  private loadCashflowStatus(): void {
    const cashflowStatus = Object.values(CashflowStatusEnum)
      .filter(v => typeof v === 'number')
      .map(v => ({
        cashflowStatusID: v as number,
        cashflowStatusName: CashflowStatusEnum[v]
      }));

    this.cashflowStatuses.set(cashflowStatus);
  }

  onCashflowStausSelect(id?: number) {
    this.pageNumber.set(1);
    this.selectedCashflowStatusId.set(id);
  }

  override requestParams = computed(() => ({
    pageNumber: this.pageNumber(),
    pageSize: this.pageSize(),
    cashflowStatusId: this.selectedCashflowStatusId(),
    searchKey: this.searchText() || undefined,
  }));

  // ======================================================
  // TABLE CONFIG
  // ======================================================
  columns: DashboardTableColumnModel<CashflowReadModel>[] = [
    {
      key: 'orderID',
      header: 'Order No',
      cell: p => p.customerOrderResponseDto!.orderID
    },
    {
      key: 'amountPaid',
      header: 'Amount Paid',
      cell: p => p.amountPaid
    },
    {
      key: 'cashflowRef',
      header: 'Reference',
      cell: p => p.cashflowRef
    },
    {
      key: 'cashflowDate',
      header: 'Date',
      cell: p => new Date(p.cashflowDate).toLocaleString()
    },
    {
      key: 'refundDate',
      header: 'Refund Date',
      cell: p => new Date(p.refundDate!).toLocaleString()
    }
  ];

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private cashflowService: CashflowService) {
    super();
    this.loading = this.cashflowService.loading;

    // Load static data
    this.loadCashflowStatus();

    effect(() => {
      this.requestParams();
      this.loadItems();
    });
  }

  // ======================================================
  // BASE CLASS IMPLEMENTATIONS
  // ======================================================
  protected loadItems(): void {
    const params = this.requestParams();

    this.cashflowService
      .getCashflowPaged(
        params.pageNumber,
        params.pageSize,
        params.cashflowStatusId,
        params.searchKey
      )
      .subscribe(res => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }
}
