import { UserRoleEnum } from "../../config/enums/userRoleEnum";

export interface UserModel {
    userID: number;
    email: string;
    role: UserRoleEnum;
}
