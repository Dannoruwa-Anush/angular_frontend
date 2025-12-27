export enum EmployeePositionEnum {
    Cashier = 1,
    Manager = 2,
}

export function getEmployeePositionName(position: EmployeePositionEnum): string {
  switch (position) {
    case EmployeePositionEnum.Cashier:
      return 'Cashier';
    case EmployeePositionEnum.Manager:
      return 'Manager';
    default:
      throw new Error(`Unknown position: ${position}`);
  }
}