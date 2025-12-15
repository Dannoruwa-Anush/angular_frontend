import { Component } from '@angular/core';

import { MaterialModule } from '../../../custom_modules/material/material-module';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-component',
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {

  images = [
    'assets/images/banner/banner1.png',
    'assets/images/banner/banner2.png',
  ];

  currentSlide = 0;

  constructor(
    private router: Router
  ) {
    setInterval(() => this.nextSlide(), 1000); // auto-play every 1s
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.images.length) % this.images.length;
  }
  
  goToProducts() {
    this.router.navigate(['/products']);
  }
}
