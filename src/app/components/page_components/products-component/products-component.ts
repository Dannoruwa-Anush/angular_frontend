import { Component, OnInit } from '@angular/core';
import { BrandModel } from '../../../models/api_models/brandModel';
import { BrandService } from '../../../services/api_services/brandService';

@Component({
  selector: 'app-products-component',
  imports: [],
  templateUrl: './products-component.html',
  styleUrl: './products-component.scss',
})
export class ProductsComponent implements OnInit {

  brands: BrandModel[] = [];

  constructor(
    private brandService: BrandService,
  ) { }

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands() {
    this.brandService.getAll().subscribe(res => {
      console.log(res);
    });
  }
}
