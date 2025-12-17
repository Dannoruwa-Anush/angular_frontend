import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../custom_modules/material/material-module';

@Component({
  selector: 'app-base-dashboard-component',
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  templateUrl: './base-dashboard-component.html',
  styleUrl: './base-dashboard-component.scss',
})
export class BaseDashboardComponent {

}
