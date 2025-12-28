import { Component, computed, effect, OnInit, signal } from '@angular/core';

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
import { BrandReadModel } from '../../../models/api_models/read_models/brand_read_Model';

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


  // ---------- CONFIG ----------
  private baseUrl = environment.BASE_API_URL.replace(/\/$/, '');

  // ---------- STATE ----------
  brands = signal<BrandReadModel[]>([]);
  categories = signal<CategoryModel[]>([]);
  electronicItems = signal<ElectronicItemModel[]>([]);

  pageNumber = signal(1);
  pageSize = signal(10);
  totalCount = signal(0);

  selectedBrandId = signal<number | undefined>(undefined);
  selectedCategoryId = signal<number | undefined>(undefined);
  searchText = signal('');

  // ---------- DERIVED ----------
  totalPages = computed(() =>
    Math.ceil(this.totalCount() / this.pageSize())
  );

  selectedBrandName = computed(() =>
    this.brands().find(b => b.brandID === this.selectedBrandId())?.brandName
  );

  selectedCategoryName = computed(() =>
    this.categories().find(c => c.categoryID === this.selectedCategoryId())?.categoryName
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

    // Load static data
    this.loadBrands();
    this.loadCategories();

    // Reactive product loading
    effect(() => {
      this.loadElectronicItems();
    });
  }

  // ---------- LOADERS ----------
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

  // ---------- UI ACTIONS ----------
  onBrandSelect(id?: number) {
    this.pageNumber.set(1);
    this.selectedBrandId.set(id);
  }

  onCategorySelect(id?: number) {
    this.pageNumber.set(1);
    this.selectedCategoryId.set(id);
  }

  onSearch(text: string) {
    this.pageNumber.set(1);
    this.searchText.set(text);
  }

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
