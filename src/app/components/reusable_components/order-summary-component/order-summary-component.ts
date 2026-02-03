import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { CustomerOrderReadModel } from '../../../models/api_models/read_models/customerOrder_read_Model';
import { OrderPaymentStatusEnum } from '../../../config/enums/orderPaymentStatusEnum';
import { OrderStatusEnum, getOrderStatusLabel } from '../../../config/enums/orderStatusEnum';
import { FileService } from '../../../services/ui_service/fileService';

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
  getOrderStatusLabel = getOrderStatusLabel;
  
  OrderPaymentStatusEnum = OrderPaymentStatusEnum;

  displayedColumns = [
    'index',
    'product',
    'unitPrice',
    'quantity',
    'subTotal'
  ];

  constructor(
    public fileService: FileService,
  ) { }

  // Stepper index based on order status 
  getStepIndex(): number {
    switch (this.order.orderStatus) {

      case OrderStatusEnum.Pending:
        return 0;

      case OrderStatusEnum.Processing:
        return 1;

      case OrderStatusEnum.Shipped:
        return 2;

      case OrderStatusEnum.Delivered:
      case OrderStatusEnum.DeliveredAfterCancellationRejected:
        return 3;

      case OrderStatusEnum.Cancel_Pending:
        return 4;

      case OrderStatusEnum.Cancelled:
        return 5;

      default:
        return 0;
    }
  }

  formatDate(date?: string): string {
    return date ? new Date(date).toLocaleDateString() : '—';
  }
}
