import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../custom_modules/material/material-module';
import { ORDER_SUBMIT_WIZARD_STEPS } from '../../../../config/orderSubmitWizardSteps';
import { OrderSubmitWizardStepStateService } from '../../../../services/ui_service/orderSubmitWizardStepStateService';

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



  steps = ORDER_SUBMIT_WIZARD_STEPS;

  activeStepIndex = computed(() => {
    const path = this.route.firstChild?.snapshot.routeConfig?.path;
    const index = this.steps.findIndex(s => s.route === path);
    return index >= 0 ? index : 0;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public stepState: OrderSubmitWizardStepStateService
  ) { }

  next(): void {
    const index = this.activeStepIndex();

    if (index < this.steps.length - 1) {
      this.stepState.completeStep(this.steps[index].route);

      this.router.navigate(
        [this.steps[index + 1].route],
        { relativeTo: this.route }
      );
    }
  }

  back(): void {
    const index = this.activeStepIndex();

    if (index > 0) {
      this.router.navigate(
        ['../', this.steps[index - 1].route],
        { relativeTo: this.route }
      );
    }
  }
}
