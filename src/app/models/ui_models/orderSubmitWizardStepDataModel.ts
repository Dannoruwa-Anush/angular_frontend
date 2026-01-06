import { Type } from '@angular/core';

export interface OrderSubmitWizardStepDataModel {
  label: string;
  route: string;
  component: Type<any>;
}