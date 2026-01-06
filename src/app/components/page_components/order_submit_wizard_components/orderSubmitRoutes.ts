import { Routes } from "@angular/router";
import { BaseOrderSubmitWizardComponent } from "./base-order-submit-wizard-component/base-order-submit-wizard-component";
import { OrderSubmitGuard } from "../../../utils/auth_utils/orderSubmitGuard";
import { ORDER_SUBMIT_WIZARD_STEPS } from "../../../config/orderSubmitWizardSteps";

export const ORDDER_SUBMIT_ROUTES: Routes = [
    {
        path: 'order',
        component: BaseOrderSubmitWizardComponent,
        canActivate: [OrderSubmitGuard],
        children: [
            { path: '', redirectTo: ORDER_SUBMIT_WIZARD_STEPS[0].route, pathMatch: 'full' },

            ...ORDER_SUBMIT_WIZARD_STEPS.map(step => ({
                path: step.route,
                component: step.component
            }))
        ]
    }
];