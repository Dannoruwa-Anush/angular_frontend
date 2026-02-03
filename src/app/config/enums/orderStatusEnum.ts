export enum OrderStatusEnum {
    Pending = 1,    
    Processing = 2, 
    Shipped = 3,
    Delivered = 4,
    Cancel_Pending = 5, 
    Cancelled = 6,      
    DeliveredAfterCancellationRejected = 7, 
}

//conver Enums to Human-readable labels for UI
export function getOrderStatusLabel(status: OrderStatusEnum): string {
  switch (status) {
    case OrderStatusEnum.Pending:
      return 'Pending';

    case OrderStatusEnum.Processing:
      return 'Processing';

    case OrderStatusEnum.Shipped:
      return 'Shipped';

    case OrderStatusEnum.Delivered:
      return 'Delivered';

    case OrderStatusEnum.Cancel_Pending:
      return 'Cancel Requested';

    case OrderStatusEnum.Cancelled:
      return 'Cancelled';

    case OrderStatusEnum.DeliveredAfterCancellationRejected:
      return 'Delivered (Cancel Rejected)';

    default:
      return 'Unknown';
  }
}