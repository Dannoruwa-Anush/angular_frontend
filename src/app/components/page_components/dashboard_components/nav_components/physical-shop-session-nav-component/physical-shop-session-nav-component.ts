import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';

@Component({
  selector: 'app-physical-shop-session-nav-component',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './physical-shop-session-nav-component.html',
  styleUrl: './physical-shop-session-nav-component.scss',
})
export class PhysicalShopSessionNavComponent {

  // true = active, false = inactive
  isActive = signal(false);


  activateSession() {
    this.isActive.set(true);
  }


  deactivateSession() {
    this.isActive.set(false);
  }
}
