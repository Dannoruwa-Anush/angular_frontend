import { Routes } from '@angular/router';
import { LayoutComponent } from './components/reusable_components/layout-component/layout-component';
import { HomeComponent } from './components/page_components/home-component/home-component';
import { ProductsComponent } from './components/page_components/products-component/products-component';
import { ProductComponent } from './components/page_components/product-component/product-component';
import { ShoppingCartComponent } from './components/page_components/shopping-cart-component/shopping-cart-component';
import { LoginComponent } from './components/page_components/auth_components/login-component/login-component';
import { RegisterComponent } from './components/page_components/auth_components/register-component/register-component';
import { DASHBOARD_ROUTES } from './components/page_components/dashboard_components/dashboardRoutes';
import { BnplInstallmentCalculatorComponent } from './components/reusable_components/calculator_simulator_component/bnpl-installment-calculator-component/bnpl-installment-calculator-component';
import { BnplInstallmentPaymentSimulatorComponent } from './components/reusable_components/calculator_simulator_component/bnpl-installment-payment-simulator-component/bnpl-installment-payment-simulator-component';
import { PaymentComponent } from './components/reusable_components/payment-component/payment-component';
import { OrderPlacementConfirmationComponent } from './components/page_components/order_submit_wizard_components/wizard_components/order-placement-confirmation-component/order-placement-confirmation-component';
import { ORDDER_SUBMIT_ROUTES } from './components/page_components/order_submit_wizard_components/orderSubmitRoutes';
import { PlaceOrderComponent } from './components/page_components/order_submit_wizard_components/wizard_components/place-order-component/place-order-component';

export const routes: Routes = [
    {
        //root routes
        path: '', component: LayoutComponent, 

        //nested routes
        children: [
            { path: '', component: HomeComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'product/:id', component: ProductComponent },
            { path: 'shoppingCart', component: ShoppingCartComponent},
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },

            // Dashboard routes
            ...DASHBOARD_ROUTES,

            // Order Submitting routes
            ...ORDDER_SUBMIT_ROUTES,

            //TODO : add auth guard
            { path: 'place_order', component: PlaceOrderComponent },
            { path: 'order_placement_confirmation', component: OrderPlacementConfirmationComponent },
            { path: 'bnpl_installment_calculator', component: BnplInstallmentCalculatorComponent },
            { path: 'bnpl_installment_payment_simulator', component: BnplInstallmentPaymentSimulatorComponent },
            { path: 'payment', component: PaymentComponent },
        ]
    }
];
