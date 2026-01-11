import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { CustomerOrderService } from '../../../../../services/api_services/customerOrderService';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { InstallmetSnapshotService } from '../../../../../services/api_services/installmentSnapshotService';
import { AuthSessionService } from '../../../../../services/auth_services/authSessionService';
import { BnplSnapShotPayingSimulationCreateModel } from '../../../../../models/api_models/create_update_models/create_models/bnplSnapShotPayingSimulation_create_Model';

@Component({
  selector: 'app-bnpl-installmet-payment-simulator-nav-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    //DashboardFormComponent
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
        result: (s.total_InstallmentBaseArrears ?? 0) - (r?.paidToArrears ?? 0)
      },
      {
        description: 'Late Interest',
        amount: s.total_LateInterest,
        paid: r?.paidToInterest ?? 0,
        result: (s.total_LateInterest ?? 0) - (r?.paidToInterest ?? 0)
      },
      {
        description: 'Due Current Base Amount',
        amount: s.notYetDueCurrentInstallmentBaseAmount,
        paid: r?.paidToBase ?? 0,
        result: (s.notYetDueCurrentInstallmentBaseAmount ?? 0) - (r?.paidToBase ?? 0)
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
    private installmentSnapshotService: InstallmetSnapshotService,
    private messageService: SystemMessageService,
    private fb: FormBuilder
  ) {
    this.buildForm();
  }

  // ======================================================
  // REACTIVE FORM SETUP
  // ======================================================
  private buildForm(): void {
    this.form = this.fb.group({
      orderId: [null, Validators.required],
      paymentAmount: [null, [Validators.required, Validators.min(1)]]
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: BnplSnapShotPayingSimulationCreateModel = {
      orderId: this.form.value.orderId!,
      paymentAmount: this.form.value.paymentAmount!
    };

    this.installmentSnapshotService
      .SimulateSnapShoptPaying(payload)
      .subscribe({
        next: res => this.simulation.set(res),
        error: () => this.messageService.error('Simulation failed')
      });
  }

  // ===============================
  // GENERATE INVOICE
  // ===============================
  generateInvoice(): void {
    this.messageService.success('Invoice generation triggered');
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
  // TABLE ROW CLASS FOR DYNAMIC HIGHLIGHTING
  // ===============================
  getRowClass(row: any): string {
    if (row.result === 0) return 'row-paid';
    if (row.result < 0) return 'row-overpaid';
    return '';
  }
}
