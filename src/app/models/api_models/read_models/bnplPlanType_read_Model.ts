export interface BnplPlanTypeReadModel {
    bnpl_PlanTypeID: number;
    bnpl_PlanTypeName: string;
    bnpl_DurationDays: number;
    interestRate: number;
    latePayInterestRatePerDay: number;
    bnpl_Description: string;
}