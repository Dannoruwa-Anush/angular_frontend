export interface BnplPlanTypeCreateUpdateModel {
    bnpl_PlanTypeName: string;
    bnpl_DurationDays: number;
    interestRate: number;
    latePayInterestRate: number;
    bnpl_Description: string;
}