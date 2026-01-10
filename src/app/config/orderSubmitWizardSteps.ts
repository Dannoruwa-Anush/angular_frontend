import { CheckoutOrderComponent } from "../components/page_components/order_submit_wizard_components/wizard_components/checkout-order-component/checkout-order-component";
import { CustomerShippingDetailVerificationComponent } from "../components/page_components/order_submit_wizard_components/wizard_components/customer-shipping-detail-verification-component/customer-shipping-detail-verification-component";
import { OrderPlacementConfirmationComponent } from "../components/page_components/order_submit_wizard_components/wizard_components/order-placement-confirmation-component/order-placement-confirmation-component";
import { PaymentComponent } from "../components/reusable_components/payment-component/payment-component";
import { OrderSubmitWizardStepDataModel } from "../models/ui_models/orderSubmitWizardStepDataModel";

export const ORDER_SUBMIT_WIZARD_STEPS: OrderSubmitWizardStepDataModel[] = [
    {
        label: 'Checkout',
        route: 'checkout_order',
        component: CheckoutOrderComponent
    },
    {
        label: 'Verfication',
        route: 'shipping_verification',
        component: CustomerShippingDetailVerificationComponent
    },
    //Confirm or Cancel
    //Order Placement Result + Show inline invoice preview dialog
    //PAyment Handle with invoice
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