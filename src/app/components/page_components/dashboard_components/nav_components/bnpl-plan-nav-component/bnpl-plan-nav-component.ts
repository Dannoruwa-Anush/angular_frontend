import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { BnplPlanReadModel } from '../../../../../models/api_models/read_models/bnpl_plan_read_model';
import { DashboardNavListOnlyStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavListOnlyStateBase';
import { DashboardTableColumnModel } from '../../../../../models/ui_models/dashboardTableColumnModel';

import { DashboardTableComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-table-component/dashboard-table-component';
import { BnplPlanService } from '../../../../../services/api_services/bnplPlanService';

@Component({
  selector: 'app-bnpl-plan-nav-component',
  imports: [
    MaterialModule,
    CommonModule,
    DashboardTableComponent
  ],
  templateUrl: './bnpl-plan-nav-component.html',
  styleUrl: './bnpl-plan-nav-component.scss',
})
export class BnplPlanNavComponent extends DashboardNavListOnlyStateBase<BnplPlanReadModel> {




  // ======================================================
  // TABLE CONFIG
  // ======================================================
  columns: DashboardTableColumnModel<BnplPlanReadModel>[] = [
    {
      key: 'bnpl_AmountPerInstallment',
      header: 'Amount Per Installment (Rs.)',
      cell: p => p.bnpl_AmountPerInstallment
    },
    {
      key: 'bnpl_TotalInstallmentCount',
      header: 'Total Installment Count',
      cell: p => p.bnpl_TotalInstallmentCount
    },
    {
      key: 'bnpl_RemainingInstallmentCount',
      header: 'Remaining Installment Count',
      cell: p => p.bnpl_RemainingInstallmentCount
    },
    {
      key: 'bnpl_StartDate',
      header: 'Start Date',
      cell: p => new Date(p.bnpl_StartDate).toLocaleString()
    },
    {
      key: 'bnpl_NextDueDate',
      header: 'Next Due Date',
      cell: p => new Date(p.bnpl_NextDueDate).toLocaleString() 
    },
    {
      key: 'bnpl_PlanTypeName',
      header: 'Bnpl Plan Type',
      cell: p => p.bnpL_PlanTypeResponseDto!.bnpl_PlanTypeName
    },
    {
      key: 'orderID',
      header: 'Order No',
      cell: p => p.customerOrderResponseDto!.orderID
    },
  ];

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private bnplPlanService: BnplPlanService) 
  {
    super();
    this.loading = this.bnplPlanService.loading;

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

    this.bnplPlanService
      .getBnplPlanPaged(
        params.pageNumber,
        params.pageSize,
        undefined,
        params.searchKey
      )
      .subscribe(res => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }
}
