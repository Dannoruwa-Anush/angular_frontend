import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { OrderStatusUiModel } from '../../../../../models/ui_models/orderStatusUiModel';
import { PaymentStatusUiModel } from '../../../../../models/ui_models/paymentStatusUiModel';
import { AuthSessionService } from '../../../../../services/auth_services/authSessionService';
import { UserRoleEnum } from '../../../../../config/enums/userRoleEnum';
import { CustomerOrderUpdateModel } from '../../../../../models/api_models/create_update_models/update_models/customerOrder_update_Model';

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



  
  // ======================================================
  // STATE
  // ======================================================

  UserRoleEnum = UserRoleEnum;
  role!: UserRoleEnum;

  //Signal used to force reloads
  private reloadTrigger = signal(0);

  orderStatuses = signal<OrderStatusUiModel[]>([]);
  paymentStatuses = signal<PaymentStatusUiModel[]>([]);

  selectedOrderStatusId = signal<number | undefined>(undefined);
  selectedPaymentStatusId = signal<number | undefined>(undefined);

  selectedOrder = signal<CustomerOrderReadModel | null>(null);

  selectedOrderStatusName = computed(() =>
    this.selectedOrderStatusId()
      ? OrderStatusEnum[this.selectedOrderStatusId()!]
      : undefined
  );

  selectedPaymentStatusName = computed(() =>
    this.selectedPaymentStatusId()
      ? OrderPaymentStatusEnum[this.selectedPaymentStatusId()!]
      : undefined
  );

  // ======================================================
  // REQUEST PARAMS (override base)
  // ======================================================

  override requestParams = computed(() => ({
    pageNumber: this.pageNumber(),
    pageSize: this.pageSize(),
    paymentStatusId: this.selectedPaymentStatusId(),
    orderStatusId: this.selectedOrderStatusId(),
    searchKey:
      this.role === UserRoleEnum.Customer
        ? this.auth.email() ?? undefined
        : this.searchText() || undefined,
  }));

  // ======================================================
  // TABLE CONFIG
  // ======================================================

  columns: DashboardTableColumnModel<CustomerOrderReadModel>[] = [
    { key: 'orderID', header: 'Order No', cell: o => o.orderID },
    { key: 'totalAmount', header: 'Total Amount (Rs.)', cell: o => o.totalAmount },
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

  // ======================================================
  // CONSTRUCTOR
  // ======================================================

  constructor(
    private customerOrderService: CustomerOrderService,
    private auth: AuthSessionService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper,
  ) {
    super();

    this.role = this.auth.role()!;
    this.loading = this.customerOrderService.loading;

    this.loadOrderStatus();
    this.loadPaymentStatus();

    //Single reactive data pipeline
    effect(() => {
      this.requestParams();   // paging / search / filters
      this.reloadTrigger();   // manual reloads

      this.loadItems();       // required by base
    });
  }

  // ======================================================
  // FILTER HANDLERS
  // ======================================================

  onOrderStausSelect(id?: number) {
    this.pageNumber.set(1);
    this.selectedOrderStatusId.set(id);
  }

  onPaymentStatusSelect(id?: number) {
    this.pageNumber.set(1);
    this.selectedPaymentStatusId.set(id);
  }

  private loadOrderStatus() {
    this.orderStatuses.set(
      Object.values(OrderStatusEnum)
        .filter(v => typeof v === 'number')
        .map(v => ({
          orderStatusID: v as number,
          orderStatusName: OrderStatusEnum[v]
        }))
    );
  }

  private loadPaymentStatus() {
    this.paymentStatuses.set(
      Object.values(OrderPaymentStatusEnum)
        .filter(v => typeof v === 'number')
        .map(v => ({
          paymentStatusID: v as number,
          paymentStatusName: OrderPaymentStatusEnum[v]
        }))
    );
  }

  // ======================================================
  // PERMISSIONS
  // ======================================================

  canEdit(order: CustomerOrderReadModel): boolean {
    if (this.role === UserRoleEnum.Customer) {
      return (
        order.orderStatus === OrderStatusEnum.Pending ||
        order.orderStatus === OrderStatusEnum.Processing
      );
    }
    return true; // Employee / Admin
  }

  // ======================================================
  // EDIT / UPDATE LOGIC
  // ======================================================

  override edit(order: CustomerOrderReadModel): void {
    this.role === UserRoleEnum.Customer
      ? this.openCustomerCancellation(order)
      : this.openEmployeeStatusUpdate(order);
  }

  private openCustomerCancellation(order: CustomerOrderReadModel) {
    const id = order.orderID;
    if (!id) return;

    this.confirmationHelper
      .confirmProcessWithInput(
        'Cancel Order',
        'Please provide a cancellation reason',
        'Cancellation reason',
        'Cancel Order',
        'Back'
      )
      .subscribe(result => {
        if (!result?.confirmed || !result.value?.trim()) return;

        const payload: CustomerOrderUpdateModel = {
          cancellationReason: result.value.trim(),
          newOrderStatus: OrderStatusEnum.Cancel_Pending
        };

        this.customerOrderService.update(id, payload).subscribe({
          next: () => {
            this.messageService.success('Cancellation requested');
            this.resetForm();
            this.reloadTrigger.update(v => v + 1);
          },
          error: err =>
            this.messageService.error(err?.error?.message || 'Update failed')
        });
      });
  }

  private openEmployeeStatusUpdate(order: CustomerOrderReadModel) {
    const id = order.orderID;
    if (!id) return;

    const nextStatus = this.getNextEmployeeStatuses(order.orderStatus)[0];
    if (!nextStatus) return;

    this.confirmationHelper
      .confirmProcessWithInput(
        'Update Order Status',
        `Confirm update to "${OrderStatusEnum[nextStatus]}"`,
        'Note',
        'Confirm',
        'Back'
      )
      .subscribe(result => {
        if (!result?.confirmed) return;

        const payload: CustomerOrderUpdateModel = {
          newOrderStatus: nextStatus
        };

        this.customerOrderService.update(id, payload).subscribe({
          next: () => {
            this.messageService.success('Order updated');
            this.resetForm();
            this.reloadTrigger.update(v => v + 1);
          },
          error: err =>
            this.messageService.error(err?.error?.message || 'Update failed')
        });
      });
  }

  private getNextEmployeeStatuses(status: OrderStatusEnum): OrderStatusEnum[] {
    switch (status) {
      case OrderStatusEnum.Pending: return [OrderStatusEnum.Processing];
      case OrderStatusEnum.Processing: return [OrderStatusEnum.Shipped];
      case OrderStatusEnum.Shipped: return [OrderStatusEnum.Delivered];
      case OrderStatusEnum.Cancel_Pending:
        return [OrderStatusEnum.DeliveredAfterCancellationRejected];
      default:
        return [];
    }
  }

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
        params.paymentStatusId,
        params.orderStatusId,
        params.searchKey
      )
      .subscribe(res => {
        this.items.set([...res.items]); // force new reference
        this.totalCount.set(res.totalCount);
      });
  }

  protected loadToForm(item: CustomerOrderReadModel, mode: DashboardModeEnum) {
    this.selectedItemId.set(item.orderID ?? null);
    this.selectedOrder.set(item);
    this.formMode.set(mode);
  }

  protected resetForm() {
    this.selectedItemId.set(null);
    this.selectedOrder.set(null);
    this.formMode.set(DashboardModeEnum.CREATE);
  }
}