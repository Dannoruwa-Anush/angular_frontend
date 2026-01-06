import { Injectable, signal } from "@angular/core";
import { ORDER_SUBMIT_WIZARD_STEPS } from "../../config/orderSubmitWizardSteps";

@Injectable({ providedIn: 'root' })
export class OrderSubmitWizardStepStateService {

    /*
       * Stores the highest completed step index
       * -1 means no steps completed yet
    */
    private completedStepIndex = signal<number>(-1);
    completedIndex = this.completedStepIndex.asReadonly();

    completeStep(stepRoute: string): void {
        const index = ORDER_SUBMIT_WIZARD_STEPS.findIndex(s => s.route === stepRoute);
        if (index === -1) return;

        if (index > this.completedStepIndex()) {
            this.completedStepIndex.set(index);
        }
    }

    canAccess(stepRoute: string): boolean {
        const index = ORDER_SUBMIT_WIZARD_STEPS.findIndex(s => s.route === stepRoute);
        if (index === -1) return false;
        if (index === 0) return true;
        return this.completedStepIndex() >= index - 1;
    }

    isCompleted(stepRoute: string): boolean {
        const index = ORDER_SUBMIT_WIZARD_STEPS.findIndex(s => s.route === stepRoute);
        if (index === -1) return false;
        return this.completedStepIndex() >= index;
    }

    reset(): void {
        this.completedStepIndex.set(-1);
    }
}