import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';

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
