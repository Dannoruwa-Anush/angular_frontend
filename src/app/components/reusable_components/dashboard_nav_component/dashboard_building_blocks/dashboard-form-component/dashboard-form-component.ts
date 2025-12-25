import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';

@Component({
  selector: 'app-dashboard-form-component',
  imports: [
    MaterialModule
  ],
  templateUrl: './dashboard-form-component.html',
  styleUrl: './dashboard-form-component.scss',
})
export class DashboardFormComponent {

  @Input() submitLabel = 'Save';
  @Input() submitDisabled = false;

  @Output() cancel = new EventEmitter<void>();
}
