import { snapshotPaymentStatusEnum } from "../../../config/enums/snapshotPaymentStatusEnum";
import { SnapshotStatusEnum } from "../../../config/enums/snapshotStatusEnum";
import { BnplPlanReadModel } from "./bnpl_plan_read_model";

export interface InstallmetSnapshotReadModel {
    settlementID: number;
    currentInstallmentNo: number;
    notYetDueCurrentInstallmentBaseAmount: number;
    total_InstallmentBaseArrears: number;
    total_LateInterest: number;
    total_PayableSettlement: number;
    paid_AgainstNotYetDueCurrentInstallmentBaseAmount: number;
    paid_AgainstTotalArrears: number;
    paid_AgainstTotalLateInterest: number;
    total_OverpaymentCarriedToNext: number;
    bnpl_PlanSettlementSummaryRef: string;
    bnpl_PlanSettlementSummary_Status: SnapshotStatusEnum;
    isLatest: boolean;
    bnpl_PlanSettlementSummary_PaymentStatus: snapshotPaymentStatusEnum;

    // FK : Fields
    bnpL_PlanResponseDto?: BnplPlanReadModel;
}