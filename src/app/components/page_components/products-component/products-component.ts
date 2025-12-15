import { Component, OnInit } from '@angular/core';

import { BrandModel } from '../../../models/api_models/brandModel';
import { BrandService } from '../../../services/api_services/brandService';
import { CategoryModel } from '../../../models/api_models/categoryModel';
import { ElectronicItemModel } from '../../../models/api_models/electronicItemModel';
import { CategoryService } from '../../../services/api_services/categoryService';
import { ElectronicItemService } from '../../../services/api_services/electronicItemService';

@Component({
  selector: 'app-products-component',
  imports: [],
  templateUrl: './products-component.html',
  styleUrl: './products-component.scss',
})
export class ProductsComponent implements OnInit {

  brands: BrandModel[] = [];
  categories: CategoryModel[] = [];
  allElectronicItems: ElectronicItemModel[] = []; // original list

  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService,
    private electronicItemService: ElectronicItemService,
  ) { }

  ngOnInit(): void {
    this.loadBrands();
    this.loadCategories();
    this.loadProducts();
  }

  loadBrands() {
    this.brandService.getAll().subscribe(res => {
      console.log(res);
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(res => {
      console.log(res);
    });
  }

  loadProducts() {
    this.electronicItemService.getElectronicItemPaged(1, 10, "").subscribe(res => {
      console.log(res);
    });
  }
}
