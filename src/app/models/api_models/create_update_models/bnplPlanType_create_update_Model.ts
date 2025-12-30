export interface BnplPlanTypeCreateUpdateModel {
    bnpl_PlanTypeName: string;
    bnpl_DurationDays: number;
    interestRate: number;
    latePayInterestRatePerDay: number;
    bnpl_Description: string;
}