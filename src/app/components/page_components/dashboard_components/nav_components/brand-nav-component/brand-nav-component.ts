import { Component, computed, effect, signal, ViewChild } from '@angular/core';

import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { BrandModel } from '../../../../../models/api_models/brandModel';
import { BrandService } from '../../../../../services/api_services/brandService';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { CrudOperationConfirmationUiHelper } from '../../../../../utils/crudOperationConfirmationUiHelper';
import { DashboardModeEnum } from '../../../../../config/enums/dashboardModeEnum';
import { DashboardNavStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavStateBase';
import { DashboardFormComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-form-component/dashboard-form-component';
import { DashboardTableComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-table-component/dashboard-table-component';
import { DashboardTableColumnModel } from '../../../../../models/ui_models/dashboardTableColumnModel';


@Component({
  selector: 'app-brand-nav-component',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    DashboardFormComponent,
    DashboardTableComponent
  ],
  templateUrl: './brand-nav-component.html',
  styleUrl: './brand-nav-component.scss',
})
export class BrandNavComponent extends DashboardNavStateBase<BrandModel> {



  // ======================================================
  // FORM
  // ======================================================
  form!: FormGroup;
  submitted = false;

  @ViewChild(FormGroupDirective)
  private formDirective!: FormGroupDirective;

  // ======================================================
  // TABLE CONFIG
  // ======================================================
  columns: DashboardTableColumnModel<BrandModel>[] = [
    {
      key: 'brandName',
      header: 'Brand',
      cell: b => b.brandName
    },
    {
      key: 'createdAt',
      header: 'Created',
      cell: b => new Date(b.createdAt!).toLocaleString()
    }
  ];

  displayedColumns = ['brandName', 'createdAt', 'actions'];

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private brandService: BrandService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper,
    private fb: FormBuilder,
  ) {
    super();

    this.buildForm();
    this.loading = this.brandService.loading;

    // Auto reload when paging / search changes
    effect(() => {
      this.requestParams();
      this.loadItems();
    });
  }

  // ======================================================
  // REACTIVE FORM SETUP
  // ======================================================
  private buildForm(): void {
    this.form = this.fb.group({
      brandName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z\s]+$/)
        ]
      ]
    });
  }

  // ===============================
  // GETTERS
  // ===============================
  get brandNameCtrl() {
    return this.form.get('brandName')!;
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

    this.form.patchValue({
      brandName: brand.brandName
    });

    mode === DashboardModeEnum.VIEW
      ? this.form.disable()
      : this.form.enable();

    this.formMode.set(mode);
  }

  // ===============================
  // RESET
  // ===============================
  protected resetForm(): void {
    this.submitted = false;
    this.formDirective.resetForm();

    this.form.enable();
    this.selectedItemId.set(null);
    this.formMode.set(DashboardModeEnum.CREATE);
  }

  // ===============================
  // SUBMIT
  // ===============================
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid || this.isViewMode()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isEditMode() ? this.update() : this.save();
  }

  // ======================================================
  // CRUD OPERATIONS
  // ======================================================
  save(): void {
    this.confirmationHelper.confirmSave('brand').subscribe(confirmed => {
      if (!confirmed) return;

      const payload: BrandModel = this.form.getRawValue();

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
    const id = this.selectedItemId();
    if (!id) return;

    this.confirmationHelper.confirmUpdate('brand').subscribe(confirmed => {
      if (!confirmed) return;

      const payload: BrandModel = {
        brandID: id,
        ...this.form.getRawValue()
      }

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