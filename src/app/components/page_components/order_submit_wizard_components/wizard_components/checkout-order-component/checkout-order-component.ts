import { CommonModule } from '@angular/common';
import { Component, computed, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { ShoppingCartItemModel } from '../../../../../models/ui_models/shoppingCartItemModel';
import { ShoppingCartService } from '../../../../../services/ui_service/shoppingCartService';
import { OrderSubmitWizardStepStateService } from '../../../../../services/ui_service/orderSubmitWizardStepStateService';
import { AuthSessionService } from '../../../../../services/auth_services/authSessionService';
import { UserRoleEnum } from '../../../../../config/enums/userRoleEnum';
import { MatDialog } from '@angular/material/dialog';
import { BnplInstallmentCalculatorComponent } from '../../../../reusable_components/calculator_simulator_component/bnpl-installment-calculator-component/bnpl-installment-calculator-component';


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
  installmentPlan = 3;

  isCustomer = computed(
    () => this.authSessionService.role() === UserRoleEnum.Customer
  );
  
  constructor(
    private stepState: OrderSubmitWizardStepStateService,
    private authSessionService: AuthSessionService,
    private cartService: ShoppingCartService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.cartItems = this.cartService.cartItems;
    this.total = this.cartService.cartTotal;
  }

  onPaymentTypeChange(type: 'NOW' | 'LATER') {
    this.paymentType = type;

    if (type === 'LATER' && !this.isCustomer()) {
      this.openBnplCalculator();
    }
  }
openBnplCalculator() {
    const dialogRef = this.dialog.open(BnplInstallmentCalculatorComponent, {
      width: '480px',
      maxWidth: '95vw',
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
      } else {
        // user cancelled dialog
        if (!this.bnplPlan) {
          this.paymentType = 'NOW';
        }
      }
    });
  }

  completeCheckout() {
    // Validate form, cart, etc...
    this.stepState.completeStep('checkout');
  }
}
