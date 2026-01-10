import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { ORDER_SUBMIT_WIZARD_STEPS } from '../../../../config/orderSubmitWizardSteps';
import { OrderSubmitWizardStepStateService } from '../../../../services/ui_service/orderSubmitWizardStepStateService';
import { filter } from 'rxjs';
import { SystemOperationConfirmService } from '../../../../services/ui_service/systemOperationConfirmService';

@Component({
  selector: 'app-base-order-submit-wizard-component',
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './base-order-submit-wizard-component.html',
  styleUrl: './base-order-submit-wizard-component.scss',
})
export class BaseOrderSubmitWizardComponent {



  // ============================
  // STATE
  // ============================
  readonly steps = ORDER_SUBMIT_WIZARD_STEPS;
  readonly activeStepIndex = signal(0);

  // ============================
  // DERIVED STATE
  // ============================
  readonly isFirstStep = computed(() => this.activeStepIndex() === 0);
  readonly isLastStep = computed(() => this.activeStepIndex() === this.steps.length - 1);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public stepState: OrderSubmitWizardStepStateService,
    private confirmService: SystemOperationConfirmService,
  ) {
    this.syncStepWithRoute();
  }

  // ============================
  // ROUTE SYNC
  // ============================
  private syncStepWithRoute(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const path = this.route.firstChild?.snapshot.routeConfig?.path;
        const index = this.steps.findIndex(step => step.route === path);
        this.activeStepIndex.set(index >= 0 ? index : 0);
      });
  }

  // ============================
  // NAVIGATION
  // ============================
  next(): void {
    if (this.isLastStep()) return;

    const index = this.activeStepIndex();
    this.stepState.completeStep(this.steps[index].route);

    this.router.navigate(
      [this.steps[index + 1].route],
      { relativeTo: this.route }
    );
  }

  back(): void {
    if (this.isFirstStep()) return;

    const index = this.activeStepIndex();
    this.router.navigate(
      [this.steps[index - 1].route],
      { relativeTo: this.route }
    );
  }

  // ============================
  // LAST STEP ACTIONS
  // ============================
  cancelOrder(): void {
    this.confirmService.confirm({
      title: 'Cancel Order',
      message: 'Do you want to cancel this order?',
      confirmText: 'Yes',
      cancelText: 'No'
    })
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.stepState.reset();
        this.router.navigate(['/products']);
      });
  }

  confirmOrder(): void {
    // Final confirmation is handled inside the last step component
    // This button triggers the verify component's confirmOrder()
  }
}
