import { UserRoleEnum } from "../../../../../config/enums/userRoleEnum";

export interface RegisterRequestModel {
  email: string;
  password: string;
  role: UserRoleEnum;
}
