import { Type } from '@angular/core';

export interface OrderWizardStepDataModel {
  label: string;
  route: string;
  component: Type<any>;
}