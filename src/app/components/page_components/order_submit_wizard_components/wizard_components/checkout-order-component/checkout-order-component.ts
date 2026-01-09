import { CommonModule } from '@angular/common';
import { Component, computed, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { ShoppingCartItemModel } from '../../../../../models/ui_models/shoppingCartItemModel';
import { ShoppingCartService } from '../../../../../services/ui_service/shoppingCartService';
import { OrderSubmitWizardStepStateService } from '../../../../../services/ui_service/orderSubmitWizardStepStateService';
import { AuthSessionService } from '../../../../../services/auth_services/authSessionService';
import { UserRoleEnum } from '../../../../../config/enums/userRoleEnum';
import { MatDialog } from '@angular/material/dialog';
import { BnplInstallmentCalculatorComponent } from '../../../../reusable_components/calculator_simulator_component/bnpl-installment-calculator-component/bnpl-installment-calculator-component';
import { OrderSubmitWizardStateService } from '../../../../../services/ui_service/orderSubmitWizardStateService';
import { CustomerOrderCreateModel } from '../../../../../models/api_models/create_update_models/create_models/customerOrder_create_Model';
import { OrderSourceEnum } from '../../../../../config/enums/orderSourceEnum';
import { OrderPaymentModeEnum } from '../../../../../config/enums/orderPaymentModeEnum';


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




  cartItems!: Signal<ShoppingCartItemModel[]>;
  total!: Signal<number>;

  bnplPlan: any | null = null;
  paymentType: 'NOW' | 'LATER' = 'NOW';

  isCustomer = computed(
    () => this.auth.role() === UserRoleEnum.Customer
  );

  constructor(
    private stepState: OrderSubmitWizardStepStateService,
    private wizardState: OrderSubmitWizardStateService,
    private auth: AuthSessionService,
    private cartService: ShoppingCartService,
    private dialog: MatDialog
  ) {
    this.cartItems = this.cartService.cartItems;
    this.total = this.cartService.cartTotal;
  }

  // -------------------------
  // PAYMENT MODE
  // -------------------------
  onPaymentTypeChange(type: 'NOW' | 'LATER') {
    this.paymentType = type;

    if (type === 'LATER' && !this.isCustomer()) {
      this.openBnplCalculator();
    }
  }

  openBnplCalculator() {
    const dialogRef = this.dialog.open(BnplInstallmentCalculatorComponent, {
      width: '960px',
      maxWidth: '98vw',
      maxHeight: '90vh',
      disableClose: true,
      data: {
        total: this.total(),
        plan: this.bnplPlan,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bnplPlan = result;
        this.paymentType = 'LATER';
      } else if (!this.bnplPlan) {
        this.paymentType = 'NOW';
      }
    });
  }

  // -------------------------
  // COMPLETE CHECKOUT
  // -------------------------
  completeCheckout() {

    if (!this.cartItems().length) return;

    // Lock cart
    this.cartService.lockCart();

    const order: CustomerOrderCreateModel = {
      orderSource: this.isCustomer()
        ? OrderSourceEnum.OnlineShop
        : OrderSourceEnum.PhysicalShop,

      orderPaymentMode:
        this.paymentType === 'LATER'
          ? OrderPaymentModeEnum.Pay_Bnpl
          : OrderPaymentModeEnum.Pay_now_full,

      customerOrderElectronicItems: this.cartItems().map(i => ({
        e_ItemID: i.productId,
        quantity: i.quantity
      }))
    };

    // BNPL fields (only if applicable)
    if (this.paymentType === 'LATER' && this.bnplPlan) {
      order.bnpl_PlanTypeID = this.bnplPlan.planTypeId;
      order.bnpl_InstallmentCount = this.bnplPlan.installmentCount;
      order.bnpl_InitialPayment = this.bnplPlan.initialPayment;
    }

    // Save wizard draft
    this.wizardState.init(order);

    // Mark step complete
    this.stepState.completeStep('checkout');
  }
}
