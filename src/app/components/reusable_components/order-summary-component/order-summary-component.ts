import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { CustomerOrderReadModel } from '../../../models/api_models/read_models/customerOrder_read_Model';
import { OrderPaymentStatusEnum } from '../../../config/enums/orderPaymentStatusEnum';
import { OrderStatusEnum } from '../../../config/enums/orderStatusEnum';

@Component({
  selector: 'app-order-summary-component',
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './order-summary-component.html',
  styleUrl: './order-summary-component.scss',
})
export class OrderSummaryComponent {

  @Input({ required: true }) order!: CustomerOrderReadModel;

  OrderStatusEnum = OrderStatusEnum;
  OrderPaymentStatusEnum = OrderPaymentStatusEnum;

  displayedColumns = [
    'index',
    'product',
    'unitPrice',
    'quantity',
    'subTotal'
  ];
}
