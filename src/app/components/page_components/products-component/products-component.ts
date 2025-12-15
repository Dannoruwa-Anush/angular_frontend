import { Component, computed, effect, OnInit, signal } from '@angular/core';

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
export class ProductsComponent {

  protected baseUrl = environment.BASE_API_URL.replace(/\/$/, '');

  // -------------------------
  // SOURCE SIGNALS
  // -------------------------
  pageNumber = signal(1);
  pageSize = signal(10);

  selectedBrandId = signal<number | undefined>(undefined);
  selectedCategoryId = signal<number | undefined>(undefined);
  searchText = signal('');

  // -------------------------
  // DATA SIGNALS
  // -------------------------
  brands = signal<BrandModel[]>([]);
  categories = signal<CategoryModel[]>([]);
  electronicItems = signal<ElectronicItemModel[]>([]);
  totalCount = signal(0);

  // -------------------------
  // COMPUTED SIGNALS
  // -------------------------
  totalPages = computed(() =>
    Math.ceil(this.totalCount() / this.pageSize())
  );

  requestParams = computed(() => ({
    pageNumber: this.pageNumber(),
    pageSize: this.pageSize(),
    brandId: this.selectedBrandId(),
    categoryId: this.selectedCategoryId(),
    searchKey: this.searchText() || undefined,
  }));

  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService,
    private electronicItemService: ElectronicItemService,
    private router: Router
  ) {

    // -------------------------
    // EFFECT:
    // -------------------------
    effect(() => {
      this.loadElectronicItems();
    });

    // initial static loads
    this.loadBrands();
    this.loadCategories();
  }

  // -------------------------
  // LOADERS
  // -------------------------
  private loadElectronicItems(): void {
    const params = this.requestParams();

    this.electronicItemService
      .getElectronicItemPaged(
        params.pageNumber,
        params.pageSize,
        params.categoryId,
        params.brandId,
        params.searchKey
      )
      .subscribe(res => {
        this.electronicItems.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }

  private loadBrands(): void {
    this.brandService.getAll().subscribe(res => {
      this.brands.set(res);
    });
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe(res => {
      this.categories.set(res);
    });
  }

  // -------------------------
  // FILTER HANDLERS
  // -------------------------
  onBrandSelect(brandId?: number) {
    this.selectedBrandId.set(brandId);
    this.pageNumber.set(1);
  }

  onCategorySelect(categoryId?: number) {
    this.selectedCategoryId.set(categoryId);
    this.pageNumber.set(1);
  }

  onSearch(text: string) {
    this.searchText.set(text);
    this.pageNumber.set(1);
  }

  // -------------------------
  // PAGINATION
  // -------------------------
  nextPage() {
    if (this.pageNumber() < this.totalPages()) {
      this.pageNumber.update(p => p + 1);
    }
  }

  previousPage() {
    if (this.pageNumber() > 1) {
      this.pageNumber.update(p => p - 1);
    }
  }

  // -------------------------
  // UI HELPERS
  // -------------------------
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
