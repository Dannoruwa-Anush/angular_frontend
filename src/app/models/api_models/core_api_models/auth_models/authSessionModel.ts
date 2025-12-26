import { UserRoleEnum } from "../../../../config/enums/userRoleEnum";

export interface AuthSessionModel {
  token: string;
  email: string;
  role: UserRoleEnum;
  userID: number;
}
