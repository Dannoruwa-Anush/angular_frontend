import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../custom_modules/material/material-module';

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


  steps = ['checkout', 'payment', 'confirmation'];

  activeStep = computed(() => {
    const path = this.route.firstChild?.snapshot.routeConfig?.path;
    return Math.max(this.steps.indexOf(path!), 0);
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  next() {
    const i = this.activeStep();
    if (i < this.steps.length - 1) {
      this.router.navigate(['../', this.steps[i + 1]], { relativeTo: this.route });
    }
  }

  back() {
    const i = this.activeStep();
    if (i > 0) {
      this.router.navigate(['../', this.steps[i - 1]], { relativeTo: this.route });
    }
  }
}
