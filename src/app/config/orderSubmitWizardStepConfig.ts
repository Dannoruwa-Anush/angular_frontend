import { CheckoutOrderComponent } from "../components/page_components/order_submit_wizard_components/wizard_components/checkout-order-component/checkout-order-component";
import { OrderPlacementConfirmationComponent } from "../components/page_components/order_submit_wizard_components/wizard_components/order-placement-confirmation-component/order-placement-confirmation-component";
import { PaymentComponent } from "../components/reusable_components/payment-component/payment-component";
import { orderWizardStepConfigDataModel } from "../models/ui_models/orderWizardStepConfigDataModel";

export const ORDER_STEPS: orderWizardStepConfigDataModel[] = [
    {
        label: 'Checkout',
        route: 'checkout_order',
        component: CheckoutOrderComponent
    },
    {
        label: 'Payment',
        route: 'payment',
        component: PaymentComponent
    },
    {
        label: 'Confirmation',
        route: 'confirmation',
        component: OrderPlacementConfirmationComponent
    }

    /*
    { path: 'place_order', component: PlaceOrderComponent },
    { path: 'bnpl_installment_calculator', component: BnplInstallmentCalculatorComponent },
    { path: 'bnpl_installment_payment_simulator', component: BnplInstallmentPaymentSimulatorComponent },
    */
];