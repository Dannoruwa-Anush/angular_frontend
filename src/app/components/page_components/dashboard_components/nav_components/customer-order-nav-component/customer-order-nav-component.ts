import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
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
  // COMPONENT SPECIFIC THINGS
  // ======================================================
  UserRoleEnum = UserRoleEnum;
  role!: UserRoleEnum;

  orderStatuses = signal<OrderStatusUiModel[]>([]);
  selectedOrderStatusId = signal<number | undefined>(undefined);

  selectedOrderStatusName = computed(() => {
    const id = this.selectedOrderStatusId();
    return id ? OrderStatusEnum[id] : undefined;
  });

  private loadOrderStatus(): void {
    const orderStatus = Object.values(OrderStatusEnum)
      .filter(v => typeof v === 'number')
      .map(v => ({
        orderStatusID: v as number,
        orderStatusName: OrderStatusEnum[v]
      }));

    this.orderStatuses.set(orderStatus);
  }

  onOrderStausSelect(id?: number) {
    this.pageNumber.set(1);
    this.selectedOrderStatusId.set(id);
  }

  paymentStatuses = signal<PaymentStatusUiModel[]>([]);
  selectedPaymentStatusId = signal<number | undefined>(undefined);

  selectedPaymentStatusName = computed(() => {
    const id = this.selectedPaymentStatusId();
    return id ? OrderPaymentStatusEnum[id] : undefined;
  });

  private loadPaymentStatus(): void {
    const paymentStatus = Object.values(OrderPaymentStatusEnum)
      .filter(v => typeof v === 'number')
      .map(v => ({
        paymentStatusID: v as number,
        paymentStatusName: OrderPaymentStatusEnum[v]
      }));

    this.paymentStatuses.set(paymentStatus);
  }

  onPaymentStatusSelect(id?: number) {
    this.pageNumber.set(1);
    this.selectedPaymentStatusId.set(id);
  }

  protected override getSearchKey(): string | undefined {
    if (this.role === UserRoleEnum.Customer) {
      return this.auth.email() ?? undefined;
    }

    return this.searchText() || undefined;
  }

  override requestParams = computed(() => ({
    pageNumber: this.pageNumber(),
    pageSize: this.pageSize(),
    paymentStatusId: this.selectedPaymentStatusId(),
    orderStatusId: this.selectedOrderStatusId(),
    searchKey: this.searchText() || undefined,
  }));


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
    private auth: AuthSessionService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper,
  ) {
    super();

    this.role = this.auth.role()!;

    this.loading = this.customerOrderService.loading;

    // Load static data
    this.loadOrderStatus();
    this.loadPaymentStatus();

    // Auto reload when paging / search changes
    effect(() => {
      this.requestParams();
      this.loadItems();
    });
  }

  // ======================================================
  // PROCESS ORDER
  // ======================================================

  canEdit(order: CustomerOrderReadModel): boolean {
    if (this.role === UserRoleEnum.Customer) {
      return order.orderStatus === OrderStatusEnum.Pending;
    }
    return true; // Employee
  }

  override edit(order: CustomerOrderReadModel): void {
    if (this.role === UserRoleEnum.Customer) {
      this.openCustomerCancellation(order);
      return;
    }

    this.openEmployeeStatusUpdate(order);
  }

  private openCustomerCancellation(order: CustomerOrderReadModel): void {
    const id = order.orderID;
    if (!id) return;

    if (order.orderStatus !== OrderStatusEnum.Pending) {
      this.messageService.error('Only pending orders can be cancelled.');
      return;
    }

    this.confirmationHelper.confirmProcessWithInput(
      'Cancel Order',
      'Please provide a cancellation reason',
      'Cancellation reason',
      'Cancel Order',
      'Back'
    ).subscribe(result => {
      if (!result || result === false) return;

      if (!result.confirmed || !result.value?.trim()) {
        this.messageService.error('Cancellation reason is required.');
        return;
      }

      const payload: CustomerOrderUpdateModel = {
        cancellationReason: result.value.trim(),
        newOrderStatus: OrderStatusEnum.Cancel_Pending
      };

      this.customerOrderService.update(id, payload).subscribe({
        next: () => {
          this.messageService.success('Order cancellation requested successfully');
          this.resetForm();
          this.loadItems();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Update failed');
        }
      });
    });
  }

  private getNextEmployeeStatuses(status: OrderStatusEnum): OrderStatusEnum[] {
    switch (status) {
      case OrderStatusEnum.Pending:
        return [OrderStatusEnum.Shipped];

      case OrderStatusEnum.Shipped:
        return [OrderStatusEnum.Delivered];

      case OrderStatusEnum.Cancel_Pending:
        return [OrderStatusEnum.DeliveredAfterCancellationRejected];

      default:
        return [];
    }
  }

  private openEmployeeStatusUpdate(order: CustomerOrderReadModel): void {
    const id = order.orderID;
    if (!id) return;

    const nextStatuses = this.getNextEmployeeStatuses(order.orderStatus);

    if (!nextStatuses.length) {
      this.messageService.error('No valid status transition available.');
      return;
    }

    // Enforce single logical transition
    const nextStatus = nextStatuses[0];

    const requiresReason =
      nextStatus === OrderStatusEnum.DeliveredAfterCancellationRejected;

    const title = 'Update Order Status';
    const message = `Are you sure you want to update the order status to "${OrderStatusEnum[nextStatus]}"?`;

    this.confirmationHelper.confirmProcessWithInput(
      title,
      message,
      requiresReason
        ? 'Enter cancellation rejection reason'
        : 'Enter confirmation note',
      'Confirm',
      'Back'
    ).subscribe(result => {
      if (!result || result === false) return;

      if (!result.confirmed) return;

      const reason = result.value?.trim();

      // Even though input is required by helper, keep business validation explicit
      if (requiresReason && !reason) {
        this.messageService.error('Cancellation rejection reason is required.');
        return;
      }

      const payload: CustomerOrderUpdateModel = {
        newOrderStatus: nextStatus,
        cancellationApproved:
          order.orderStatus === OrderStatusEnum.Cancel_Pending
            ? nextStatus !== OrderStatusEnum.DeliveredAfterCancellationRejected
            : undefined,
        cancellationRejectionReason:
          requiresReason ? reason : undefined
      };

      this.customerOrderService.update(id, payload).subscribe({
        next: () => {
          this.messageService.success(
            `Order status updated to "${OrderStatusEnum[nextStatus]}".`
          );
          this.resetForm();
          this.loadItems();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Update failed.');
        }
      });
    });
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
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }

  protected loadToForm(item: CustomerOrderReadModel, mode: DashboardModeEnum): void {
    this.selectedItemId.set(item.orderID ?? null);

    this.selectedOrder.set(item);
    this.formMode.set(mode);
  }

  protected resetForm(): void {
    this.selectedItemId.set(null);
    this.selectedOrder.set(null);
    this.formMode.set(DashboardModeEnum.CREATE);
  }
}