import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { CustomerOrderReadModel } from '../../../../../models/api_models/read_models/customerOrder_read_Model';
import { DashboardNavStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavStateBase';
import { DashboardModeEnum } from '../../../../../config/enums/dashboardModeEnum';
import { DashboardTableColumnModel } from '../../../../../models/ui_models/dashboardTableColumnModel';
import { CustomerOrderService } from '../../../../../services/api_services/customerOrderService';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { CrudOperationConfirmationUiHelper } from '../../../../../utils/crudOperationConfirmationUiHelper';
import { DashboardTableComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-table-component/dashboard-table-component';
import { OrderStatusEnum } from '../../../../../config/enums/orderStatusEnum';
import { OrderPaymentStatusEnum } from '../../../../../config/enums/orderPaymentStatusEnum';
import { OrderSummaryComponent } from '../../../../reusable_components/order-summary-component/order-summary-component';

@Component({
  selector: 'app-customer-order-nav-component',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    OrderSummaryComponent,
    DashboardTableComponent
  ],
  templateUrl: './customer-order-nav-component.html',
  styleUrl: './customer-order-nav-component.scss',
})
export class CustomerOrderNavComponent extends DashboardNavStateBase<CustomerOrderReadModel> {

  selectedOrder = signal<CustomerOrderReadModel | null>(null);


  // ======================================================
  // TABLE CONFIG
  // ======================================================
  columns: DashboardTableColumnModel<CustomerOrderReadModel>[] = [
    {
      key: 'orderID',
      header: 'Order No',
      cell: o => o.orderID
    },
    {
      key: 'totalAmount',
      header: 'Total Amount (Rs.)',
      cell: o => o.totalAmount
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      cell: o => new Date(o.orderDate).toLocaleString()
    },
    {
      key: 'orderStatus',
      header: 'Order Status',
      cell: o => OrderStatusEnum[o.orderStatus]
    },
    {
      key: 'paymentCompletedDate',
      header: 'Payment Completed Date',
      cell: o => new Date(o.paymentCompletedDate!).toLocaleString()
    },
    {
      key: 'orderPaymentStatus',
      header: 'Order Payment Status',
      cell: o => OrderPaymentStatusEnum[o.orderPaymentStatus]
    }
  ];

  displayedColumns = ['orderID', 'totalAmount', 'orderDate', 'orderStatus', 'paymentCompletedDate', 'orderPaymentStatus'];

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private customerOrderService: CustomerOrderService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper,
    //private fb: FormBuilder,
  ) {
    super();

    //this.buildForm();
    this.loading = this.customerOrderService.loading;

    // Auto reload when paging / search changes
    effect(() => {
      this.requestParams();
      this.loadItems();
    });
  }

  // ======================================================
  // REACTIVE FORM SETUP
  // ======================================================
  //order status




  // ======================================================
  // BASE CLASS IMPLEMENTATIONS
  // ======================================================
  protected override getId(item: CustomerOrderReadModel): number | null {
    return item.orderID ?? null;
  }

  protected override loadItems(): void {
    const params = this.requestParams();

    this.customerOrderService
      .getCustomerOrderPaged(
        params.pageNumber,
        params.pageSize,
        1,        //paymentStatusId,
        1,//orderStatusId,
        params.searchKey
      )
      .subscribe(res => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }

  protected loadToForm(item: CustomerOrderReadModel, mode: DashboardModeEnum): void {
    this.selectedOrder.set(item);
    this.formMode.set(mode);
  }

  protected resetForm(): void {
    this.selectedOrder.set(null);
    this.formMode.set(DashboardModeEnum.CREATE);
  }
}