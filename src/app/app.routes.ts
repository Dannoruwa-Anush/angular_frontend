import { Routes } from '@angular/router';
import { LayoutComponent } from './components/reusable_components/layout-component/layout-component';
import { HomeComponent } from './components/page_components/home-component/home-component';
import { ProductsComponent } from './components/page_components/products-component/products-component';
import { ProductComponent } from './components/page_components/product-component/product-component';

export const routes: Routes = [
    {
        //root routes
        path: '', component: LayoutComponent, 

        //nested routes
        children: [
            { path: '', component: HomeComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'product/:id', component: ProductComponent },
        ]
    }
];
