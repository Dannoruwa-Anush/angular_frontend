import { Type } from '@angular/core';

export interface orderWizardStepConfigDataModel {
  label: string;
  route: string;
  component: Type<any>;
}