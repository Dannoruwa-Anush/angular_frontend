import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { DashboardNavListOnlyStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavListOnlyStateBase';
import { InstallmetSnapshotReadModel } from '../../../../../models/api_models/read_models/installment_snapshot_read_model';
import { DashboardTableColumnModel } from '../../../../../models/ui_models/dashboardTableColumnModel';
import { InstallmetSnapshotService } from '../../../../../services/api_services/installmentSnapshotService';
import { DashboardTableComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-table-component/dashboard-table-component';

@Component({
  selector: 'app-installment-snapshot-nav-component',
  imports: [
    MaterialModule,
    CommonModule,
    DashboardTableComponent
  ],
  templateUrl: './installment-snapshot-nav-component.html',
  styleUrl: './installment-snapshot-nav-component.scss',
})
export class InstallmentSnapshotNavComponent extends DashboardNavListOnlyStateBase<InstallmetSnapshotReadModel>{
  



  // ======================================================
  // TABLE CONFIG
  // ======================================================
  columns: DashboardTableColumnModel<InstallmetSnapshotReadModel>[] = [
    {
      key: 'orderID',
      header: 'Order No',
      cell: s => s.bnpL_PlanResponseDto!.customerOrderResponseDto!.orderID
    },
    {
      key: 'currentInstallmentNo',
      header: 'Installment No',
      cell: s => s.currentInstallmentNo
    },
    {
      key: 'notYetDueCurrentInstallmentBaseAmount',
      header: 'Base Installment',
      cell: s => s.notYetDueCurrentInstallmentBaseAmount
    },
    {
      key: 'total_InstallmentBaseArrears',
      header: 'Arrears',
      cell: s => s.total_InstallmentBaseArrears
    },
    {
      key: 'total_LateInterest',
      header: 'Late Interest',
      cell: s => s.total_LateInterest
    },
    {
      key: 'total_PayableSettlement',
      header: 'Total Payable Settlement',
      cell: s => s.total_PayableSettlement
    },
    {
      key: 'total_OverpaymentCarriedToNext',
      header: 'Overpayment',
      cell: s => s.total_OverpaymentCarriedToNext
    }
  ];

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private installmetSnapshotService: InstallmetSnapshotService)
  {
    super();
    this.loading = this.installmetSnapshotService.loading;

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

    this.installmetSnapshotService
      .getLatestSnapshotPaged(
        params.pageNumber,
        params.pageSize,
        params.searchKey
      )
      .subscribe(res => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }
}
