import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { ORDER_SUBMIT_WIZARD_STEPS } from "../../config/orderSubmitWizardSteps";
import { OrderSubmitWizardStepStateService } from "../../services/ui_service/orderSubmitWizardStepStateService";

@Injectable({ providedIn: 'root' })
export class OrderSubmitWizardStepGuard implements CanActivate {




  constructor(
    private stepState: OrderSubmitWizardStepStateService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const stepRoute = route.routeConfig?.path;
    if (!stepRoute) return false;

    if (this.stepState.canAccess(stepRoute)) {
      return true;
    }

    // Redirect to last allowed step
    const lastAllowedIndex = Math.max(
      this.stepState.completedIndex(),
      0
    );

    this.router.navigate([
      '/submit_order',
      ORDER_SUBMIT_WIZARD_STEPS[lastAllowedIndex].route
    ]);

    return false;
  }
}