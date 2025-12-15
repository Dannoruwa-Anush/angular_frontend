import { Component, OnInit } from '@angular/core';

import { BrandModel } from '../../../models/api_models/brandModel';
import { BrandService } from '../../../services/api_services/brandService';
import { CategoryModel } from '../../../models/api_models/categoryModel';
import { ElectronicItemModel } from '../../../models/api_models/electronicItemModel';
import { CategoryService } from '../../../services/api_services/categoryService';
import { ElectronicItemService } from '../../../services/api_services/electronicItemService';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../config/environment';

@Component({
  selector: 'app-products-component',
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './products-component.html',
  styleUrl: './products-component.scss',
})
export class ProductsComponent implements OnInit {

  protected baseUrl = environment.BASE_API_URL.replace(/\/$/, '');

  brands: BrandModel[] = [];
  categories: CategoryModel[] = [];
  electronicItems: ElectronicItemModel[] = [];

  // pagination
  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;

  // filters
  selectedBrandId?: number;
  selectedCategoryId?: number;
  searchText = '';

  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService,
    private electronicItemService: ElectronicItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBrands();
    this.loadCategories();
    this.loadProducts();
  }

  loadBrands() {
    this.brandService.getAll().subscribe(res => {
      this.brands = res;
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(res => {
      this.categories = res;
    });
  }

  loadProducts() {
    this.electronicItemService
      .getElectronicItemPaged(
        this.pageNumber,
        this.pageSize,
        this.selectedCategoryId,
        this.selectedBrandId,
        this.searchText || undefined
      )
      .subscribe(res => {
        console.log(res);
        this.electronicItems = res.items;
        this.totalCount = res.totalCount;
      });
  }

  // ---------- FILTER HANDLERS ----------

  onBrandSelect(brandId?: number) {
    this.selectedBrandId = brandId;
    this.pageNumber = 1;
    this.loadProducts();
  }

  onCategorySelect(categoryId?: number) {
    this.selectedCategoryId = categoryId;
    this.pageNumber = 1;
    this.loadProducts();
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadProducts();
  }

  // ---------- PAGINATION ----------

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadProducts();
    }
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadProducts();
    }
  }

  // ---------- UI HELPERS ----------

  openProduct(id: number) {
    this.router.navigate(['/product', id]);
  }

  getImageUrl(item: ElectronicItemModel): string {
    if (item.electronicItemImageUrl) {
      return item.electronicItemImageUrl;
    }

    if (item.electronicItemImage) {
      return `${this.baseUrl}/${item.electronicItemImage}`;
    }

    return 'assets/images/no-image.png';
  }
}
