export interface BnplSnapShotPayingSimulationReadModel {
    installmentId: number;
    paidToArrears: number;
    paidToInterest: number;
    paidToBase: number;
    remainingBalance: number;
    overPaymentCarried: number;
    resultStatus: string;
}
