import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { CustomerOrderService } from '../../../../../services/api_services/customerOrderService';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { InstallmetSnapshotService } from '../../../../../services/api_services/installmentSnapshotService';
import { AuthSessionService } from '../../../../../services/auth_services/authSessionService';
import { BnplSnapShotPayingSimulationCreateModel } from '../../../../../models/api_models/create_update_models/create_models/bnplSnapShotPayingSimulation_create_Model';
import { MatDialog } from '@angular/material/dialog';
import { CustomerSearchDialogBoxComponent } from '../../../../reusable_components/dialog_boxes/customer-search-dialog-box-component/customer-search-dialog-box-component';

@Component({
  selector: 'app-bnpl-installmet-payment-simulator-nav-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  templateUrl: './bnpl-installmet-payment-simulator-nav-component.html',
  styleUrl: './bnpl-installmet-payment-simulator-nav-component.scss',
})
export class BnplInstallmetPaymentSimulatorNavComponent {


  // ===============================
  // AUTH
  // ===============================
  readonly customerId = computed(() => this.auth.customerID());

  // ===============================
  // CUSTOMER & ORDERS
  // ===============================
  customer = signal<any | null>(null);
  orders = signal<any[]>([]);
  selectedOrder = signal<any | null>(null);

  // ===============================
  // STATE
  // ===============================
  snapshot = signal<any | null>(null);
  simulation = signal<any | null>(null);

  // ===============================
  // FORM
  // ===============================
  form!: FormGroup;

  // ===============================
  // TABLE
  // ===============================
  orderColumns = ['orderId', 'date', 'total', 'status', 'action'];
  snapshotColumns = ['description', 'amount', 'paid', 'result'];

  snapshotTableData = computed(() => {
    const s = this.snapshot();
    const r = this.simulation();
    if (!s) return [];

    return [
      {
        description: 'Arrears',
        amount: s.total_InstallmentBaseArrears,
        paid: r?.paidToArrears ?? 0,
        result: s.total_InstallmentBaseArrears - (r?.paidToArrears ?? 0)
      },
      {
        description: 'Late Interest',
        amount: s.total_LateInterest,
        paid: r?.paidToInterest ?? 0,
        result: s.total_LateInterest - (r?.paidToInterest ?? 0)
      },
      {
        description: 'Current Base Amount',
        amount: s.notYetDueCurrentInstallmentBaseAmount,
        paid: r?.paidToBase ?? 0,
        result: s.notYetDueCurrentInstallmentBaseAmount - (r?.paidToBase ?? 0)
      },
      {
        description: 'Overpayment',
        amount: 0,
        paid: r?.overPaymentCarried ?? 0,
        result: r?.overPaymentCarried ?? 0
      }
    ];
  });

  // ===============================
  // CONSTRUCTOR
  // ===============================
  constructor(
    private auth: AuthSessionService,
    private customerOrderService: CustomerOrderService,
    private snapshotService: InstallmetSnapshotService,
    private messageService: SystemMessageService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      paymentAmount: [null, [Validators.required, Validators.min(1)]]
    });

    if (this.customerId()) {
      this.loadOrders(this.customerId()!);
    }
  }

  // ===============================
  // CUSTOMER SEARCH
  // ===============================
  openCustomerSearch(): void {
    this.dialog.open(CustomerSearchDialogBoxComponent, {
      width: '600px',
      disableClose: true
    }).afterClosed().subscribe(customer => {
      if (!customer) return;
      this.customer.set(customer);
      this.loadOrders(customer.customerID);
    });
  }

  // ===============================
  // LOAD ORDERS
  // ===============================
  private loadOrders(customerId: number): void {
    this.customerOrderService
      .getActiveBnplOrdersByCustomerId(customerId)
      .subscribe({
        next: orders => this.orders.set(orders),
        error: () => this.messageService.error('Failed to load orders')
      });
  }

  // ===============================
  // SELECT ORDER
  // ===============================
  selectOrder(order: any): void {
    this.selectedOrder.set(order);
    this.simulation.set(null);
    this.form.reset();

    this.snapshotService.getByOrderId(order.orderID).subscribe({
      next: res => this.snapshot.set(res),
      error: () => this.messageService.error('Failed to load snapshot')
    });
  }

  // ===============================
  // LOAD SNAPSHOT
  // ===============================
  loadSnapshot(): void {
    const orderId = this.form.value.orderId;
    if (!orderId) return;

    this.snapshotService
      .getByOrderId(orderId)
      .subscribe({
        next: res => {
          this.snapshot.set(res)
        },
        error: () => this.messageService.error('Failed to load installment snapshot')
      });
  }

  // ===============================
  // SIMULATE PAYMENT
  // ===============================
  simulate(): void {
    if (this.form.invalid || !this.selectedOrder()) return;

    const payload: BnplSnapShotPayingSimulationCreateModel = {
      orderId: this.selectedOrder()!.orderID,
      paymentAmount: this.form.value.paymentAmount
    };

    this.snapshotService.SimulateSnapShoptPaying(payload).subscribe({
      next: res => this.simulation.set(res),
      error: () => this.messageService.error('Simulation failed')
    });
  }

  // ===============================
  // RESET FORM & SNAPSHOT
  // ===============================
  reset(): void {
    this.form.reset();
    this.snapshot.set(null);
    this.simulation.set(null);
  }

  // ===============================
  // GENERATE INVOICE
  // ===============================
  generateInvoice(): void {
    this.messageService.success('Invoice generation triggered');
  }

  // ===============================
  // TABLE ROW CLASS FOR DYNAMIC HIGHLIGHTING
  // ===============================
  getRowClass(row: any): string {
    if (row.result === 0) return 'row-paid';
    if (row.result < 0) return 'row-overpaid';
    return '';
  }
}
