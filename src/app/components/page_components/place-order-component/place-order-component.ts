import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { ShoppingCartItemModel } from '../../../models/ui_models/shoppingCartItemModel';
import { ShoppingCartService } from '../../../services/ui_service/shoppingCartService';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-place-order-component',
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './place-order-component.html',
  styleUrl: './place-order-component.scss',
})
export class PlaceOrderComponent {

}
