import { Routes } from "@angular/router";
import { CheckoutOrderComponent } from "./wizard_components/checkout-order-component/checkout-order-component";
import { BaseOrderSubmitWizardComponent } from "./base-order-submit-wizard-component/base-order-submit-wizard-component";
import { OrderSubmitGuard } from "../../../utils/auth_utils/orderSubmitGuard";

export const ORDDER_SUBMIT_ROUTES: Routes = [
    {
        path: 'order',
        component: BaseOrderSubmitWizardComponent,
        canActivate: [OrderSubmitGuard],
        children: [
            { path: '', redirectTo: 'checkout_order', pathMatch: 'full' },

            { path: 'checkout_order', component: CheckoutOrderComponent },
            //{ path: 'payment', component: PaymentComponent },
            //{ path: 'confirmation', component: OrderPlacementConfirmationComponent }
        ]
    }
];