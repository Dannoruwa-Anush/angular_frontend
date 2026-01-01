import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { DashboardTableComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-table-component/dashboard-table-component';
import { CustomerReadModel } from '../../../../../models/api_models/read_models/customer_read_Model';
import { DashboardTableColumnModel } from '../../../../../models/ui_models/dashboardTableColumnModel';
import { CustomerService } from '../../../../../services/api_services/customerService';
import { DashboardNavListOnlyStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavListOnlyStateBase';

@Component({
  selector: 'app-customer-nav-component',
  imports: [
    MaterialModule,
    CommonModule,
    DashboardTableComponent
  ],
  templateUrl: './customer-nav-component.html',
  styleUrl: './customer-nav-component.scss',
})
export class CustomerNavComponent extends DashboardNavListOnlyStateBase<CustomerReadModel> {




  // ======================================================
  // TABLE CONFIG
  // ======================================================
  columns: DashboardTableColumnModel<CustomerReadModel>[] = [
    {
      key: 'customerName',
      header: 'Customer Name',
      cell: c => c.customerName
    },
    {
      key: 'phoneNo',
      header: 'Phone No',
      cell: c => c.phoneNo
    },
    {
      key: 'address',
      header: 'Address',
      cell: c => c.address
    },
    {
      key: 'email',
      header: 'Email',
      cell: c => c.userResponseDto!.email
    }
  ];

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(private customerService: CustomerService) {
    super();
    this.loading = this.customerService.loading;

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

    this.customerService
      .getCustomerPaged(
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
