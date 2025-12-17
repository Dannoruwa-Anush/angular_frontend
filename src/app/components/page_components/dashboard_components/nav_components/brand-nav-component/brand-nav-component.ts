import { Component, computed, effect, Signal, signal } from '@angular/core';

import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { BrandModel } from '../../../../../models/api_models/brandModel';
import { BrandService } from '../../../../../services/api_services/brandService';
import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { CrudOperationConfirmationUiHelper } from '../../../../../utils/crudOperationConfirmationUiHelper';
import { DashboardModeEnum } from '../../../../../config/enums/dashboardModeEnum';

@Component({
  selector: 'app-brand-nav-component',
  imports: [
    MaterialModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './brand-nav-component.html',
  styleUrl: './brand-nav-component.scss',
})
export class BrandNavComponent {



  // ======================================================
  // STATE
  // ======================================================
  brands = signal<BrandModel[]>([]);
  loading!: Signal<boolean>;

  pageNumber = signal(1);
  pageSize = signal(10);
  totalCount = signal(0);

  // ======================================================
  // FORM STATE
  // ======================================================
  brandName = signal('');
  searchText = signal('');

  selectedBrandId = signal<number | null>(null);
  formMode = signal<DashboardModeEnum>(DashboardModeEnum.CREATE);

  displayedColumns = ['brandName', 'createdAt', 'actions'];

  // ======================================================
  // MODE HELPERS
  // ======================================================
  isEditMode = computed(() => this.formMode() === DashboardModeEnum.EDIT);
  isViewMode = computed(() => this.formMode() === DashboardModeEnum.VIEW);

  // ======================================================
  // VALIDATION
  // ======================================================
  isFormValid = computed(() => {
    const name = this.brandName().trim();
    const lettersOnlyRegex = /^[A-Za-z\s]+$/;

    return name.length > 0 && lettersOnlyRegex.test(name);
  });

  // ======================================================
  // DERIVED
  // ======================================================
  totalPages = computed(() =>
    Math.ceil(this.totalCount() / this.pageSize())
  );

  requestParams = computed(() => ({
    pageNumber: this.pageNumber(),
    pageSize: this.pageSize(),
    searchKey: this.searchText() || undefined,
  }));

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private brandService: BrandService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper
  ) {
    this.loading = this.brandService.loading;

    effect(() => {
      this.loadBrands();
    });
  }

  // ======================================================
  // LOADERS
  // ======================================================
  private loadBrands(): void {
    const params = this.requestParams();

    this.brandService
      .getBrandPaged(
        params.pageNumber,
        params.pageSize,
        params.searchKey
      )
      .subscribe(res => {
        this.brands.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }

  // ======================================================
  // FORM LOADER
  // ======================================================
  private loadToForm(
    brand: BrandModel,
    mode: DashboardModeEnum
  ): void {
    this.selectedBrandId.set(brand.brandID ?? null);
    this.brandName.set(brand.brandName);
    this.formMode.set(mode);
  }

  private resetForm(): void {
    this.brandName.set('');
    this.selectedBrandId.set(null);
    this.formMode.set(DashboardModeEnum.CREATE);
  }

  // ======================================================
  // CRUD OPERATIONS
  // ======================================================
  view(brand: BrandModel): void {
    this.loadToForm(brand, DashboardModeEnum.VIEW);
  }

  edit(brand: BrandModel): void {
    this.loadToForm(brand, DashboardModeEnum.EDIT);
  }

  onSubmit(): void {
    if (this.isEditMode()) {
      this.update();
    } else {
      this.save();
    }
  }

  save(): void {
    if (!this.isFormValid()) return;

    this.confirmationHelper.confirmSave('brand').subscribe(confirmed => {
      if (!confirmed) return;

      const payload: BrandModel = {
        brandName: this.brandName(),
      };

      this.brandService.create(payload).subscribe({
        next: () => {
          this.messageService.success('Brand saved successfully');
          this.resetForm();
          this.loadBrands();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Save failed');
        }
      });
    });
  }

  update(): void {
    if (!this.isFormValid() || !this.selectedBrandId()) return;

    this.confirmationHelper.confirmUpdate('brand').subscribe(confirmed => {
      if (!confirmed) return;

      const payload: BrandModel = {
        brandID: this.selectedBrandId()!,
        brandName: this.brandName(),
      };

      this.brandService.update(payload.brandID!, payload).subscribe({
        next: () => {
          this.messageService.success('Brand updated successfully');
          this.resetForm();
          this.loadBrands();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Update failed');
        }
      });
    });
  }

  delete(brand: BrandModel): void {
    this.confirmationHelper.confirmDelete('brand').subscribe(confirmed => {
      if (!confirmed) return;

      this.brandService.delete(brand.brandID!).subscribe({
        next: () => {
          this.messageService.success('Brand deleted successfully');
          this.loadBrands();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Delete failed');
        }
      });
    });
  }

  cancel(): void {
    this.resetForm();
  }

  // ======================================================
  // HANDLERS
  // ======================================================
  onSearch(text: string): void {
    this.pageNumber.set(1);
    this.searchText.set(text);
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }
}