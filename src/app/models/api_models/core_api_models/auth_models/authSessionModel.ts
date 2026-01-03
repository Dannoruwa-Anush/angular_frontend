import { EmployeePositionEnum } from "../../../../config/enums/employeePositionEnum";
import { UserRoleEnum } from "../../../../config/enums/userRoleEnum";

export interface AuthSessionModel {
  token: string;
  email: string;
  role: UserRoleEnum;
  userID: number;

  // If the user is an employee or a customer
  employeePosition?: EmployeePositionEnum | null;
  customerID?: number | null;
}
