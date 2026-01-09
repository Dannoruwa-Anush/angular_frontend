import { BnplPlanTypeReadModel } from "./bnplPlanType_read_Model";

export interface BnplPlanInstallmentCalculatorReadModel {
    amountPerInstallment: number;
    totalPayable: number;
    totalInterestAmount: number;

    //Fk: fields
    bnpL_PlanTypeResponseDto: BnplPlanTypeReadModel;
}
