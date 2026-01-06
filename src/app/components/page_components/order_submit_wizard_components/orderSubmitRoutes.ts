import { Routes } from "@angular/router";
import { CheckoutOrderComponent } from "./wizard_components/checkout-order-component/checkout-order-component";
import { BaseOrderSubmitWizardComponent } from "./base-order-submit-wizard-component/base-order-submit-wizard-component";
import { OrderSubmitGuard } from "../../../utils/auth_utils/orderSubmitGuard";
import { PaymentComponent } from "../../reusable_components/payment-component/payment-component";
import { OrderPlacementConfirmationComponent } from "./wizard_components/order-placement-confirmation-component/order-placement-confirmation-component";

export const ORDDER_SUBMIT_ROUTES: Routes = [
    {
        path: 'order',
        component: BaseOrderSubmitWizardComponent,
        canActivate: [OrderSubmitGuard],
        children: [
            { path: '', redirectTo: 'checkout_order', pathMatch: 'full' },

            { path: 'checkout_order', component: CheckoutOrderComponent },
            { path: 'payment', component: PaymentComponent },
            { path: 'order_placement_confirmation', component: OrderPlacementConfirmationComponent },

            /*
            //TODO : add auth guard
            { path: 'place_order', component: PlaceOrderComponent },
            { path: 'bnpl_installment_calculator', component: BnplInstallmentCalculatorComponent },
            { path: 'bnpl_installment_payment_simulator', component: BnplInstallmentPaymentSimulatorComponent },
            */
        ]
    }
];