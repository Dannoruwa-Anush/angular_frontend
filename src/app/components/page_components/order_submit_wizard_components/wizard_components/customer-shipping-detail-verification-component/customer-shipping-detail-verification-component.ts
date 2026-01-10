import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { MatDialog } from '@angular/material/dialog';
import { UserRoleEnum } from '../../../../../config/enums/userRoleEnum';
import { AuthSessionService } from '../../../../../services/auth_services/authSessionService';
import { OrderSubmitWizardStateService } from '../../../../../services/ui_service/orderSubmitWizardStateService';
import { OrderSubmitWizardStepStateService } from '../../../../../services/ui_service/orderSubmitWizardStepStateService';
import { ShoppingCartService } from '../../../../../services/ui_service/shoppingCartService';
import { CustomerService } from '../../../../../services/api_services/customerService';
import { CustomerReadModel } from '../../../../../models/api_models/read_models/customer_read_Model';
import { EmployeePositionEnum } from '../../../../../config/enums/employeePositionEnum';
import { CustomerSearchDialogBoxComponent } from '../../../../reusable_components/dialog_boxes/customer-search-dialog-box-component/customer-search-dialog-box-component';
import { CustomerOrderService } from '../../../../../services/api_services/customerOrderService';

@Component({
  selector: 'app-customer-shipping-detail-verification-component',
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './customer-shipping-detail-verification-component.html',
  styleUrl: './customer-shipping-detail-verification-component.scss',
})
export class CustomerShippingDetailVerificationComponent {




  // ============================
  // STATE
  // ============================
  customerProfile = signal<CustomerReadModel | null>(null);
  loading = signal(false);

  // ============================
  // AUTH DERIVED
  // ============================
  isCustomer = computed(
    () => this.auth.role() === UserRoleEnum.Customer
  );

  isManager = computed(
    () =>
      this.auth.employeePosition() === EmployeePositionEnum.Manager
  );

  customerId = computed(() => this.auth.customerID());

  canSubmit = computed(
    () => !!this.customerProfile() && !this.loading()
  );

  // ============================
  // CONSTRUCTOR
  // ============================
  constructor(
    private auth: AuthSessionService,
    private customerService: CustomerService,
    private orderService: CustomerOrderService,
    private cartService: ShoppingCartService,
    private wizardState: OrderSubmitWizardStateService,
    private stepState: OrderSubmitWizardStepStateService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.initCustomer();
  }

  // ============================
  // INIT
  // ============================
  private initCustomer(): void {
    if (this.isCustomer() && this.customerId()) {
      this.loadCustomerProfile(this.customerId()!);
    }
  }

  // ============================
  // LOAD CUSTOMER
  // ============================
  private loadCustomerProfile(customerId: number): void {
    this.loading.set(true);

    this.customerService.getById(customerId).subscribe({
      next: profile => {
        this.customerProfile.set(profile);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  // ============================
  // FIND CUSTOMER (MANAGER)
  // ============================
  openFindCustomerDialog(): void {
    const dialogRef = this.dialog.open(CustomerSearchDialogBoxComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      queueMicrotask(() => {
        if (!result) return;
        this.customerProfile.set(result);
      });
    });
  }

  // ============================
  // CONFIRM & PLACE ORDER
  // ============================
  placeOrder(): void {
    const payload = this.wizardState.orderDraft();
    if (!payload || !this.customerProfile()) return;

    // Manager flow
    if (!this.isCustomer()) {
      this.wizardState.update({
        physicalShopBillToCustomerID: this.customerProfile()!.customerID
      });
    }

    this.loading.set(true);

    console.log(payload);
    /*
    this.orderService.create(payload).subscribe({
      next: result => {
        this.wizardState.setResult(result);
        this.stepState.completeStep('shipping_verification');

        this.router.navigate(
          ['../confirmation'],
          { relativeTo: this.route }
        );
      },
      error: () => {
        this.loading.set(false);
        this.cartService.unlockCart();
      }
    });
    */
  }

  // ============================
  // CANCEL ORDER
  // ============================
  cancelOrder(): void {
    this.cartService.unlockCart();
    this.stepState.reset();
    this.wizardState.reset();

    this.router.navigate(['/products']);
  }
}
