import { Component } from '@angular/core';

import { MaterialModule } from '../../../custom_modules/material/material-module';

@Component({
  selector: 'app-footer-component',
  imports: [
    MaterialModule,
  ],
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.scss',
})
export class FooterComponent {

}
