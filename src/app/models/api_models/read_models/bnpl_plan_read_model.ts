import { BnplStatusEnum } from "../../../config/enums/bnplStatusEnum";
import { BnplPlanTypeReadModel } from "./bnplPlanType_read_Model";
import { CustomerOrderReadModel } from "./customerOrder_read_Model";

export interface BnplPlanReadModel {
    bnpl_PlanID: number;
    bnpl_AmountPerInstallment: number;
    bnpl_TotalInstallmentCount: number;
    bnpl_RemainingInstallmentCount: number;
    bnpl_StartDate: string;
    bnpl_NextDueDate: string;
    completedAt?: string;
    cancelledAt?: string;
    bnpl_Status: BnplStatusEnum;

    // FK : Fields
    bnpL_PlanTypeResponseDto?: BnplPlanTypeReadModel;
    customerOrderResponseDto?: CustomerOrderReadModel;
}