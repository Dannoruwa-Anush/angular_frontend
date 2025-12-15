import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeaderComponent } from '../header-component/header-component';
import { FooterComponent } from '../footer-component/footer-component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-component',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
  ],
  templateUrl: './layout-component.html',
  styleUrl: './layout-component.scss',
})
export class LayoutComponent {

}
