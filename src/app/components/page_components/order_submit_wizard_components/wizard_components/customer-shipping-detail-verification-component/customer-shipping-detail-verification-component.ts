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
import { OrderSubmitWizardActionService } from '../../../../../services/ui_service/orderSubmitWizardActionService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InvoiceDraftCreatedDialogBoxComponent } from '../../../../reusable_components/dialog_boxes/invoice-draft-created-dialog-box-component/invoice-draft-created-dialog-box-component';

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





  // ======================================================
  // STATE
  // ======================================================
  readonly customerProfile = signal<CustomerReadModel | null>(null);
  readonly loading = signal(false);

  // ======================================================
  // AUTH DERIVED
  // ======================================================
  readonly isCustomer = computed(
    () => this.auth.role() === UserRoleEnum.Customer
  );

  readonly isManager = computed(
    () => this.auth.employeePosition() === EmployeePositionEnum.Manager
  );

  readonly customerId = computed(() => this.auth.customerID());

  readonly canSubmit = computed(
    () => !!this.customerProfile() && !this.loading()
  );

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private auth: AuthSessionService,
    private customerService: CustomerService,
    private orderService: CustomerOrderService,
    private cartService: ShoppingCartService,

    private wizardState: OrderSubmitWizardStateService,
    private stepState: OrderSubmitWizardStepStateService,
    private wizardAction: OrderSubmitWizardActionService,

    private confirmService: SystemOperationConfirmService,
    private messageService: SystemMessageService,

    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.initCustomer();
    this.listenToWizardActions();
  }

  // ======================================================
  // INIT
  // ======================================================
  private initCustomer(): void {
    if (this.isCustomer() && this.customerId()) {
      this.loadCustomerProfile(this.customerId()!);
    }
  }

  private listenToWizardActions(): void {
    this.wizardAction.confirm$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.confirmOrder());

    this.wizardAction.cancel$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.cancelOrder());
  }

  // ======================================================
  // LOAD CUSTOMER
  // ======================================================
  private loadCustomerProfile(customerId: number): void {
    this.loading.set(true);

    this.customerService.getById(customerId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: profile => this.customerProfile.set(profile),
        error: () => this.messageService.error('Failed to load customer details')
      });
  }

  // ======================================================
  // FIND CUSTOMER (MANAGER)
  // ======================================================
  openFindCustomerDialog(): void {
    this.dialog.open(CustomerSearchDialogBoxComponent, {
      width: '600px',
      disableClose: true
    })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(customer => this.customerProfile.set(customer));
  }

  // ======================================================
  // CONFIRM & PLACE ORDER
  // ======================================================
  confirmOrder(): void {
    if (this.loading() || !this.canSubmit()) return;

    const payload = this.wizardState.orderDraft();

    if (!payload?.customerOrderElectronicItems?.length) {
      this.messageService.error('Order has no items');
      return;
    }

    const customer = this.customerProfile();
    if (!payload || !customer) return;

    let finalPayload = payload;

    // Manager / cashier placing order for customer
    if (!this.isCustomer()) {
      finalPayload = {
        ...payload,
        physicalShopBillToCustomerID: customer.customerID
      };
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
          this.cartService.lockCart(); // lock before API
          return this.orderService.create(finalPayload);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: result => {
          this.cartService.clearCart();   // clear cart
          this.cartService.unlockCart();  // unlock for next order

          this.messageService.success('Invoice drafted successfully');

          this.wizardState.setResult(result);
          this.stepState.completeStep('shipping_verification');

          const invoiceId = result.latestUnpaidInvoice?.invoiceID;

          if (!invoiceId) {
            // Safety fallback
            this.router.navigate(['../order_confirmation'], {
              relativeTo: this.route
            });
            return;
          }

          const dialogRef = this.dialog.open(
            InvoiceDraftCreatedDialogBoxComponent,
            {
              width: '460px',
              disableClose: true,
              data: {
                invoiceId,
                orderId: result.orderID,
                totalAmount: result.totalAmount
              }
            }
          );

          dialogRef.afterClosed().subscribe(res => {
            if (res?.action === 'review') {
              this.router.navigate(
                ['/dashboard/invoice'],
                { queryParams: { invoiceId: res.invoiceId } }
              );
            }
          });
        },
        error: () => {
          this.messageService.error('Failed to place order');
          this.cartService.unlockCart(); // unlock on failure
        }
      });
  }

  // ======================================================
  // CANCEL ORDER
  // ======================================================
  cancelOrder(): void {
    if (this.loading()) return;

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