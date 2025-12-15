import { Component } from '@angular/core';

import { MaterialModule } from '../../../custom_modules/material/material-module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-component',
  imports: [
    MaterialModule,
    RouterModule,
  ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  image_company_logo = 'assets/images/logo/logo.png';
}
