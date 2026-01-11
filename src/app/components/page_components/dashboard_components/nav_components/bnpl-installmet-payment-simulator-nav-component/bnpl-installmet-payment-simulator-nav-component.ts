import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { CustomerOrderService } from '../../../../../services/api_services/customerOrderService';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { CustomerOrderReadModel } from '../../../../../models/api_models/read_models/customerOrder_read_Model';
import { InstallmetSnapshotService } from '../../../../../services/api_services/installmentSnapshotService';
import { AuthSessionService } from '../../../../../services/auth_services/authSessionService';
import { finalize } from 'rxjs';
import { DashboardFormComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-form-component/dashboard-form-component';
import { InstallmetSnapshotReadModel } from '../../../../../models/api_models/read_models/installment_snapshot_read_model';
import { BnplSnapShotPayingSimulationReadModel } from '../../../../../models/api_models/read_models/bnplSnapShotPayingSimulation_Read_Model';

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

  // ======================================================
  // AUTH
  // ======================================================
  readonly customerId = computed(() => this.auth.customerID());

  // ======================================================
  // STATE
  // ======================================================
  loading = signal(false);

  readonly order = signal<CustomerOrderReadModel | null>(null);
  readonly snapshot = signal<InstallmetSnapshotReadModel | null>(null);
  readonly simulation = signal<BnplSnapShotPayingSimulationReadModel | null>(null);

  // ======================================================
  // FORM
  // ======================================================
  form!: FormGroup;

  constructor(
    private auth: AuthSessionService,
    private orderService: CustomerOrderService,
    private snapshotService: InstallmetSnapshotService,
    private messageService: SystemMessageService,
    private fb: FormBuilder,
  ) {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      orderId: [null, Validators.required],
      paymentAmount: [{ value: null, disabled: true }, [Validators.required, Validators.min(1)]],
    });
  }

  get orderIdCtrl() {
    return this.form.get('orderId')!;
  }

  get paymentAmountCtrl() {
    return this.form.get('paymentAmount')!;
  }

  // ======================================================
  // LOAD ORDER + SNAPSHOT (FIXED)
  // ======================================================
  loadOrder(): void {
    if (this.orderIdCtrl.invalid) {
      this.orderIdCtrl.markAsTouched();
      return;
    }

    this.loading.set(true);
    this.simulation.set(null);

    // 1️⃣ Load Order
    this.orderService
      .getActiveBnplOrder(this.orderIdCtrl.value, this.customerId()!)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: order => {
          this.order.set(order);
          this.loadLatestSnapshot(order.orderID);
        },
        error: () => this.messageService.error('Failed to load BNPL order')
      });
  }

  // ======================================================
  // LOAD LATEST SNAPSHOT (NEW & CORRECT)
  // ======================================================
  private loadLatestSnapshot(orderId: number): void {
    this.loading.set(true);

    this.snapshotService
      .getLatestSnapshotPaged(1, 1, orderId.toString())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: res => {
          if (!res.items.length) {
            this.messageService.error('No active installment snapshot found');
            return;
          }

          this.snapshot.set(res.items[0]);
          this.paymentAmountCtrl.enable();
        },
        error: () => this.messageService.error('Failed to load installment snapshot')
      });
  }

  // ======================================================
  // SIMULATION
  // ======================================================
  simulate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    this.snapshotService
      .SimulateSnapShoptPaying({
        orderId: this.orderIdCtrl.value,
        paymentAmount: this.paymentAmountCtrl.value
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: res => {
          this.simulation.set(res);
          this.messageService.success('Payment simulation successful');
        },
        error: () => this.messageService.error('Payment simulation failed')
      });
  }

  // ======================================================
  // RESET
  // ======================================================
  cancel(): void {
    this.form.reset();
    this.paymentAmountCtrl.disable();
    this.order.set(null);
    this.snapshot.set(null);
    this.simulation.set(null);
  }
}
