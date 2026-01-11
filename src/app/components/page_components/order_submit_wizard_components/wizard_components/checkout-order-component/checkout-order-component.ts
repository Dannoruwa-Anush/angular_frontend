import { CommonModule } from '@angular/common';
import { Component, computed, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { ShoppingCartItemModel } from '../../../../../models/ui_models/shoppingCartItemModel';
import { ShoppingCartService } from '../../../../../services/ui_service/shoppingCartService';
import { OrderSubmitWizardStepStateService } from '../../../../../services/ui_service/orderSubmitWizardStepStateService';
import { AuthSessionService } from '../../../../../services/auth_services/authSessionService';
import { UserRoleEnum } from '../../../../../config/enums/userRoleEnum';
import { MatDialog } from '@angular/material/dialog';
import { OrderSubmitWizardStateService } from '../../../../../services/ui_service/orderSubmitWizardStateService';
import { CustomerOrderCreateModel } from '../../../../../models/api_models/create_update_models/create_models/customerOrder_create_Model';
import { OrderSourceEnum } from '../../../../../config/enums/orderSourceEnum';
import { OrderPaymentModeEnum } from '../../../../../config/enums/orderPaymentModeEnum';
import { BnplPlanInstallmentCalculatorDialogBoxComponent } from '../../../../reusable_components/dialog_boxes/bnpl-plan-installment-calculator-dialog-box-component/bnpl-plan-installment-calculator-dialog-box-component';
import { OrderSubmitWizardActionService } from '../../../../../services/ui_service/orderSubmitWizardActionService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-checkout-order-component',
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './checkout-order-component.html',
  styleUrl: './checkout-order-component.scss',
})
export class CheckoutOrderComponent {




  // =============================
  // CART
  // =============================
  cartItems!: Signal<ShoppingCartItemModel[]>;
  total!: Signal<number>;

  // =============================
  // STATE
  // =============================
  paymentMode = signal<OrderPaymentModeEnum>(
    OrderPaymentModeEnum.Pay_now_full
  );

  bnplPlan = signal<any | null>(null);

  readonly PaymentMode = OrderPaymentModeEnum;

  isCustomer = computed(
    () => this.auth.role() === UserRoleEnum.Customer
  );

  showBnplSummary = computed(
    () =>
      this.paymentMode() === OrderPaymentModeEnum.Pay_Bnpl &&
      !!this.bnplPlan()
  );

  // =============================
  // CONSTRUCTOR
  // =============================
  constructor(
    private stepState: OrderSubmitWizardStepStateService,
    private wizardState: OrderSubmitWizardStateService,
    private wizardAction: OrderSubmitWizardActionService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthSessionService,
    private cartService: ShoppingCartService,
    private dialog: MatDialog
  ) {

    this.cartItems = this.cartService.cartItems;
    this.total = this.cartService.cartTotal;

    this.listenToWizardActions();
  }

  // Parent -> Child communication
  private listenToWizardActions(): void {
    this.wizardAction.confirm$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.completeCheckout());
  }
  // =============================
  // PAYMENT SELECTION
  // =============================
  selectPayNow() {
    this.paymentMode.set(OrderPaymentModeEnum.Pay_now_full);
    this.bnplPlan.set(null);
  }

  selectPayLater() {
    if (this.isCustomer()) return;
    this.openBnplCalculator();
  }

  // =============================
  // BNPL DIALOG
  // =============================
  openBnplCalculator() {
    const dialogRef = this.dialog.open(
      BnplPlanInstallmentCalculatorDialogBoxComponent,
      {
        width: '960px',
        maxWidth: '98vw',
        maxHeight: '90vh',
        disableClose: true,
        data: {
          total: this.total(),
          plan: this.bnplPlan(),
        }
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      queueMicrotask(() => {
        if (!result) {
          this.selectPayNow();
          return;
        }

        this.bnplPlan.set(result);
        this.paymentMode.set(OrderPaymentModeEnum.Pay_Bnpl);
      });
    });
  }

  // =============================
  // COMPLETE CHECKOUT
  // =============================
  completeCheckout(): void {
    if (!this.cartItems().length) {
      return; // cannot proceed
    }

    // Commit order data
    this.wizardState.update({
      orderSource: this.isCustomer()
        ? OrderSourceEnum.OnlineShop
        : OrderSourceEnum.PhysicalShop,

      orderPaymentMode: this.paymentMode(),

      customerOrderElectronicItems: this.cartItems().map(i => ({
        e_ItemID: i.productId,
        quantity: i.quantity
      }))
    });

    // Optional BNPL
    if (this.paymentMode() === OrderPaymentModeEnum.Pay_Bnpl && this.bnplPlan()) {
      this.wizardState.update({
        bnpl_PlanTypeID: this.bnplPlan().bnpl_PlanTypeID,
        bnpl_InstallmentCount: this.bnplPlan().installmentCount,
        bnpl_InitialPayment: this.bnplPlan().initialPayment
      });
    }

    // Mark step complete
    this.stepState.completeStep('checkout_order');

    // Navigate AFTER commit
    this.router.navigate(['../shipping_verification'], {
      relativeTo: this.route
    });
  }
}