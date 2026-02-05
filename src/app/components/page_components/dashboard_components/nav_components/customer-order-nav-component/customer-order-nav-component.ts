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
import { OrderStatusEnum, getOrderStatusLabel } from '../../../../../config/enums/orderStatusEnum';
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

  private reloadTrigger = signal(0);

  orderStatuses = signal<OrderStatusUiModel[]>([]);
  paymentStatuses = signal<PaymentStatusUiModel[]>([]);

  selectedOrderStatusId = signal<number | undefined>(undefined);
  selectedPaymentStatusId = signal<number | undefined>(undefined);

  selectedOrder = signal<CustomerOrderReadModel | null>(null);

  // expose helper to template
  getOrderStatusLabel = getOrderStatusLabel;

  selectedOrderStatusName = computed(() => {
    const id = this.selectedOrderStatusId();
    return id ? getOrderStatusLabel(id as OrderStatusEnum) : undefined;
  });

  selectedPaymentStatusName = computed(() =>
    this.selectedPaymentStatusId()
      ? OrderPaymentStatusEnum[this.selectedPaymentStatusId()!]
      : undefined
  );

  // ======================================================
  // REQUEST PARAMS
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
      cell: o => getOrderStatusLabel(o.orderStatus)
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

    effect(() => {
      this.requestParams();
      this.reloadTrigger();
      this.loadItems();
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
          orderStatusName: getOrderStatusLabel(v as OrderStatusEnum)
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
  /*
  Note:
  Customer
    Pending -> Cancel_Pending
    Delivered -> Cancel_Pending (with in Free trial period)

  Employee
    Pending -> Cancel_Pending
    Cancel_Pending -> Cancelled / CancellationRejected
    Processing -> Shipped -> Delivered
  */
  canEdit(order: CustomerOrderReadModel): boolean {
    // Never allow editing cancelled or rejected orders
    if (
      order.orderStatus === OrderStatusEnum.Cancelled ||
      order.orderStatus === OrderStatusEnum.CancellationRejected
    ) {
      return false;
    }

    if (this.role === UserRoleEnum.Customer) {
      // Customer can cancel pending orders
      if (order.orderStatus === OrderStatusEnum.Pending) return true;

      // Customer can cancel delivered orders only if free trial is not over
      if (
        order.orderStatus === OrderStatusEnum.Delivered &&
        !order.isFreeTrialOver
      ) {
        return true;
      }

      return false;
    }

    // Employees can edit all other allowed statuses
    return true;
  }

  // ======================================================
  // EDIT / UPDATE
  // ======================================================

  override edit(order: CustomerOrderReadModel): void {
    this.role === UserRoleEnum.Customer
      ? this.openCustomerCancellation(order)
      : this.openEmployeeStatusUpdate(order);
  }

  private openCustomerCancellation(order: CustomerOrderReadModel) {
    const id = order.orderID;
    if (!id) return;

    if (order.orderStatus === OrderStatusEnum.Delivered && order.isFreeTrialOver) {
      this.messageService.error(
        'Cancellation period for this order has expired (free trial is over).'
      );
      return;
    }

    this.confirmationHelper
      .confirmProcessWithInput(
        'Cancel Order',
        'Please provide a cancellation reason',
        'Cancellation reason',
        'Request Order Cancellation',
        'Back'
      )
      .subscribe(result => {
        const reason = result?.value?.trim() || result?.inputValue?.trim();
        if (!result?.confirmed || !reason) return;

        const payload: CustomerOrderUpdateModel = {
          newOrderStatus: OrderStatusEnum.Cancel_Pending,
          cancellationReason: reason
        };

        this.updateOrder(id, payload, 'Cancellation requested');
      });
  }

  private openEmployeeStatusUpdate(order: CustomerOrderReadModel) {
    const id = order.orderID;
    if (!id) return;

    const nextStatuses = this.getNextEmployeeStatuses(order.orderStatus);
    if (!nextStatuses.length) return;

    // ==================================================
    // CANCEL PENDING -> DECISION (radio + conditional input)
    // ==================================================
    if (order.orderStatus === OrderStatusEnum.Cancel_Pending) {
      this.confirmationHelper
        .confirmProcessWithRadioAndConditionalInput<OrderStatusEnum>(
          'Cancellation Decision',
          'Select how to proceed',
          [
            { label: 'Approve Cancellation', value: OrderStatusEnum.Cancelled },
            { label: 'Reject Cancellation', value: OrderStatusEnum.CancellationRejected }
          ],
          'Rejection reason',
          OrderStatusEnum.CancellationRejected,
          'Confirm',
          'Back'
        )
        .subscribe(result => {
          if (!result?.confirmed) return;

          const payload: CustomerOrderUpdateModel = {
            newOrderStatus: result.value,
            cancellationRejectionReason:
              result.value === OrderStatusEnum.CancellationRejected
                ? result.inputValue?.trim()
                : undefined
          };

          this.updateOrder(id, payload, 'Order updated');
        });

      return;
    }

    // ==================================================
    // SINGLE OPTION (auto-confirm)
    // ==================================================
    if (nextStatuses.length === 1) {
      const nextStatus = nextStatuses[0];

      this.confirmationHelper
        .confirmProcessWithInput(
          'Update Order',
          `Confirm update to "${getOrderStatusLabel(nextStatus)}"`,
          'Note',
          'Confirm',
          'Back'
        )
        .subscribe(result => {
          if (!result?.confirmed) return;

          const payload: CustomerOrderUpdateModel = {
            newOrderStatus: nextStatus
          };

          this.updateOrder(
            id,
            payload,
            nextStatus === OrderStatusEnum.Delivered
              ? 'Order delivered'
              : 'Order updated'
          );
        });

      return;
    }

    // ==================================================
    // MULTIPLE OPTIONS -> RADIO (Processing case)
    // ==================================================
    this.confirmationHelper
      .confirmProcessWithRadioAndConditionalInput<OrderStatusEnum>(
        'Update Order',
        'Select how you want to proceed',
        nextStatuses.map(s => ({
          label: getOrderStatusLabel(s),
          value: s
        })),
        'Cancellation reason',
        OrderStatusEnum.Cancel_Pending,
        'Confirm',
        'Back'
      )
      .subscribe(result => {
        if (!result?.confirmed) return;

        const payload: CustomerOrderUpdateModel = {
          newOrderStatus: result.value,
          cancellationReason:
            result.value === OrderStatusEnum.Cancel_Pending
              ? result.inputValue?.trim()
              : undefined
        };

        this.updateOrder(id, payload, 'Order updated');
      });
  }

  private getNextEmployeeStatuses(status: OrderStatusEnum): OrderStatusEnum[] {
    switch (status) {
      //Pending: Processing (will be handled by the system after the payment)
      case OrderStatusEnum.Pending:
        return [OrderStatusEnum.Cancel_Pending];

      case OrderStatusEnum.Processing:
        return [
          OrderStatusEnum.Shipped];

      case OrderStatusEnum.Shipped:
        return [OrderStatusEnum.Delivered];

      case OrderStatusEnum.Cancel_Pending:
        return [
          OrderStatusEnum.Cancelled,
          OrderStatusEnum.CancellationRejected
        ];

      default:
        return [];
    }
  }

  private updateOrder(id: number, payload: CustomerOrderUpdateModel, successMessage: string) {
    this.customerOrderService.update(id, payload).subscribe({
      next: () => {
        this.messageService.success(successMessage);
        this.resetForm();
        this.reloadTrigger.update(v => v + 1);
      },
      error: err =>
        this.messageService.error(err?.error?.message || 'Update failed')
    });
  }

  // ======================================================
  // BASE IMPLEMENTATION
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
        this.items.set([...res.items]);
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