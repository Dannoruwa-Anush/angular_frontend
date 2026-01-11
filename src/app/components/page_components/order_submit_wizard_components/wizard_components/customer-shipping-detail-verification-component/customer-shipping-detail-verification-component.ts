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
import { SystemOperationConfirmService } from '../../../../../services/ui_service/systemOperationConfirmService';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { filter, finalize, switchMap } from 'rxjs';

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
  readonly customerProfile = signal<CustomerReadModel | null>(null);
  readonly loading = signal(false);

  // ============================
  // AUTH DERIVED
  // ============================
  readonly isCustomer = computed(() => this.auth.role() === UserRoleEnum.Customer);
  readonly isManager = computed(() => this.auth.employeePosition() === EmployeePositionEnum.Manager);
  readonly customerId = computed(() => this.auth.customerID());
  readonly canSubmit = computed(() => !!this.customerProfile() && !this.loading());

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
    private confirmService: SystemOperationConfirmService,
    private messageService: SystemMessageService,
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
    const customerId = this.customerId();
    if (this.isCustomer() && customerId) {
      this.loadCustomerProfile(customerId);
    }
  }

  // ============================
  // LOAD CUSTOMER
  // ============================
  private loadCustomerProfile(customerId: number): void {
    this.loading.set(true);

    this.customerService.getById(customerId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: profile => this.customerProfile.set(profile),
        error: () => this.messageService.error('Failed to load customer details')
      });
  }

  // ============================
  // FIND CUSTOMER (MANAGER)
  // ============================
  openFindCustomerDialog(): void {
    this.dialog
      .open(CustomerSearchDialogBoxComponent, {
        width: '600px',
        disableClose: true
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(customer => this.customerProfile.set(customer));
  }

  // ============================
  // CONFIRM & PLACE ORDER
  // ============================
  confirmOrder(): void {
    const payload = this.wizardState.orderDraft();
    const customer = this.customerProfile();

    if (!payload || !customer) return;

    if (!this.isCustomer()) {
      this.wizardState.update({
        physicalShopBillToCustomerID: customer.customerID
      });
    }

    this.confirmService.confirm({
      title: 'Place Order',
      message: 'Do you want to place this order?',
      confirmText: 'Yes',
      cancelText: 'No'
    })
      .pipe(
        filter(Boolean),
        switchMap(() => {
          this.loading.set(true);
          this.cartService.lockCart();
          return this.orderService.create(payload);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: result => {
          this.messageService.success('Order placed successfully');
          this.wizardState.setResult(result);
          this.stepState.completeStep('shipping_verification');
          this.router.navigate(['../order_confirmation'], { relativeTo: this.route });
        },
        error: () => {
          this.messageService.error('Failed to place order');
          this.cartService.unlockCart();
        }
      });
  }

  // ============================
  // CANCEL ORDER
  // ============================
  cancelOrder(): void {
    this.confirmService.confirm({
      title: 'Cancel Order',
      message: 'Do you want to cancel this order?',
      confirmText: 'Yes',
      cancelText: 'No'
    })
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.cartService.unlockCart();
        this.stepState.reset();
        this.wizardState.reset();
        this.router.navigate(['/products']);
      });
  }
}
