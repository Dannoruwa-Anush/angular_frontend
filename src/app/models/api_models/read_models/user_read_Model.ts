import { UserRoleEnum } from "../../../config/enums/userRoleEnum";

export interface UserReadModel {
    userID: number;
    email: string;
    role: UserRoleEnum;
}
