import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../custom_modules/material/material-module';

@Component({
  selector: 'app-dashboard-nav-component',
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './dashboard-nav-component.html',
  styleUrl: './dashboard-nav-component.scss',
})
export class DashboardNavComponent {

  /** UI STATE (passed from feature dashboard) */
  @Input() loading = false;
  @Input() totalCount = 0;

  @Input() emptyMessage = 'No records found';
}
