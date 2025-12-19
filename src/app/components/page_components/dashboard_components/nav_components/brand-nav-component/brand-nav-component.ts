import { Component, computed, effect, signal } from '@angular/core';

import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { BrandModel } from '../../../../../models/api_models/brandModel';
import { BrandService } from '../../../../../services/api_services/brandService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { CrudOperationConfirmationUiHelper } from '../../../../../utils/crudOperationConfirmationUiHelper';
import { DashboardModeEnum } from '../../../../../config/enums/dashboardModeEnum';
import { DashboardNavStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavStateBase';

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
export class BrandNavComponent extends DashboardNavStateBase<BrandModel> {



  // ======================================================
  // FORM STATE
  // ======================================================
  brandName = signal('');

  displayedColumns = ['brandName', 'createdAt', 'actions'];

  // ======================================================
  // VALIDATION
  // ======================================================
  isFormValid = computed(() => {
    const name = this.brandName().trim();
    const lettersOnlyRegex = /^[A-Za-z\s]+$/;
    return name.length > 0 && lettersOnlyRegex.test(name);
  });

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private brandService: BrandService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper
  ) {
    super();
    this.loading = this.brandService.loading;

    // Auto reload when paging / search changes
    effect(() => {
      this.requestParams();
      this.loadItems();
    });
  }

  // ======================================================
  // BASE CLASS IMPLEMENTATIONS
  // ======================================================
  protected getId(item: BrandModel): number | null {
    return item.brandID ?? null;
  }

  protected loadItems(): void {
    const params = this.requestParams();

    this.brandService
      .getBrandPaged(
        params.pageNumber,
        params.pageSize,
        params.searchKey
      )
      .subscribe(res => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }

  protected loadToForm(
    brand: BrandModel,
    mode: DashboardModeEnum
  ): void {
    this.selectedItemId.set(brand.brandID ?? null);
    this.brandName.set(brand.brandName);
    this.formMode.set(mode);
  }

  protected resetForm(): void {
    this.brandName.set('');
    this.selectedItemId.set(null);
    this.formMode.set(DashboardModeEnum.CREATE);
  }

  // ======================================================
  // CRUD OPERATIONS
  // ======================================================
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
          this.loadItems();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Save failed');
        }
      });
    });
  }

  update(): void {
    if (!this.isFormValid() || !this.selectedItemId()) return;

    this.confirmationHelper.confirmUpdate('brand').subscribe(confirmed => {
      if (!confirmed) return;

      const payload: BrandModel = {
        brandID: this.selectedItemId()!,
        brandName: this.brandName(),
      };

      this.brandService.update(payload.brandID!, payload).subscribe({
        next: () => {
          this.messageService.success('Brand updated successfully');
          this.resetForm();
          this.loadItems();
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
          this.loadItems();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Delete failed');
        }
      });
    });
  }
}