import { effect, Injectable, signal } from "@angular/core";
import { ORDER_SUBMIT_WIZARD_STEPS } from "../../config/orderSubmitWizardSteps";

const WIZARD_STEP_KEY = 'order_submit_wizard_step';

@Injectable({ providedIn: 'root' })
export class OrderSubmitWizardStepStateService {

    /**
   * Stores the highest completed step index
   * -1 = nothing completed yet
   */
    private completedStepIndex = signal<number>(-1);

    /** Readonly exposure for UI */
    completedIndex = this.completedStepIndex.asReadonly();

    constructor() {
        // Restore wizard progress (session only)
        const saved = sessionStorage.getItem(WIZARD_STEP_KEY);
        if (saved !== null && !isNaN(+saved)) {
            this.completedStepIndex.set(+saved);
        }

        // Persist progress automatically
        effect(() => {
            sessionStorage.setItem(
                WIZARD_STEP_KEY,
                this.completedStepIndex().toString()
            );
        });
    }

    /**
     * Mark a step as completed
     * Only advances forward (never regress)
     */
    completeStep(stepRoute: string): void {
        const index = ORDER_SUBMIT_WIZARD_STEPS.findIndex(
            s => s.route === stepRoute
        );

        if (index === -1) return;

        if (index > this.completedStepIndex()) {
            this.completedStepIndex.set(index);
        }
    }

    /**
     * Guard check — can user access this step?
     */
    canAccess(stepRoute: string): boolean {
        const index = ORDER_SUBMIT_WIZARD_STEPS.findIndex(
            s => s.route === stepRoute
        );

        if (index === -1) return false;

        // First step always accessible
        if (index === 0) return true;

        // Must complete previous step
        return this.completedStepIndex() >= index - 1;
    }

    /**
     * UI helper — has step been completed?
     */
    isCompleted(stepRoute: string): boolean {
        const index = ORDER_SUBMIT_WIZARD_STEPS.findIndex(
            s => s.route === stepRoute
        );

        if (index === -1) return false;

        return this.completedStepIndex() >= index;
    }

    /**
     * Reset wizard state
     * Call on:
     * - Order cancel
     * - Order success
     * - Logout
     */
    reset(): void {
        this.completedStepIndex.set(-1);
        sessionStorage.removeItem(WIZARD_STEP_KEY);
    }
}