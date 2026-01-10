import { CommonModule } from '@angular/common';
import { Component, computed, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { MatDialog } from '@angular/material/dialog';
import { OrderPaymentModeEnum } from '../../../../../config/enums/orderPaymentModeEnum';
import { OrderSourceEnum } from '../../../../../config/enums/orderSourceEnum';
import { UserRoleEnum } from '../../../../../config/enums/userRoleEnum';
import { CustomerOrderCreateModel } from '../../../../../models/api_models/create_update_models/create_models/customerOrder_create_Model';
import { ShoppingCartItemModel } from '../../../../../models/ui_models/shoppingCartItemModel';
import { AuthSessionService } from '../../../../../services/auth_services/authSessionService';
import { OrderSubmitWizardStateService } from '../../../../../services/ui_service/orderSubmitWizardStateService';
import { OrderSubmitWizardStepStateService } from '../../../../../services/ui_service/orderSubmitWizardStepStateService';
import { ShoppingCartService } from '../../../../../services/ui_service/shoppingCartService';
import { BnplPlanInstallmentCalculatorDialogBoxComponent } from '../../../../reusable_components/dialog_boxes/bnpl-plan-installment-calculator-dialog-box-component/bnpl-plan-installment-calculator-dialog-box-component';
import { CustomerService } from '../../../../../services/api_services/customerService';
import { CustomerReadModel } from '../../../../../models/api_models/read_models/customer_read_Model';
import { EmployeePositionEnum } from '../../../../../config/enums/employeePositionEnum';
import { CustomerSearchDialogBoxComponent } from '../../../../reusable_components/dialog_boxes/customer-search-dialog-box-component/customer-search-dialog-box-component';

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

  // ============================
  // CONSTRUCTOR
  // ============================
  constructor(
    private auth: AuthSessionService,
    private customerService: CustomerService,
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
  // EDIT CUSTOMER
  // ============================
  editCustomer(): void {
    // Navigate or open edit dialog
    // this.router.navigate(['/customers/edit', this.customerProfile()?.customerID]);
  }
}
