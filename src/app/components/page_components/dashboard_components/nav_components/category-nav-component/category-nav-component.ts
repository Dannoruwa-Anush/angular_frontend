import { CommonModule } from '@angular/common';
import { Component, effect, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { DashboardFormComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-form-component/dashboard-form-component';
import { DashboardTableComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-table-component/dashboard-table-component';
import { DashboardNavStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavStateBase';
import { DashboardModeEnum } from '../../../../../config/enums/dashboardModeEnum';
import { CategoryService } from '../../../../../services/api_services/categoryService';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { CrudOperationConfirmationUiHelper } from '../../../../../utils/crudOperationConfirmationUiHelper';
import { DashboardTableColumnModel } from '../../../../../models/ui_models/dashboardTableColumnModel';
import { CategoryReadModel } from '../../../../../models/api_models/read_models/category_read_Model';
import { CategoryCreateUpdateModel } from '../../../../../models/api_models/create_update_models/category_create_update_Model';

@Component({
  selector: 'app-category-nav-component',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    DashboardFormComponent,
    DashboardTableComponent
  ],
  templateUrl: './category-nav-component.html',
  styleUrl: './category-nav-component.scss',
})
export class CategoryNavComponent extends DashboardNavStateBase<CategoryReadModel> {




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
  columns: DashboardTableColumnModel<CategoryReadModel>[] = [
    {
      key: 'categoryName',
      header: 'Category',
      cell: c => c.categoryName
    },
    {
      key: 'createdAt',
      header: 'Created',
      cell: c => new Date(c.createdAt!).toLocaleString()
    }
  ];

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private categoryService: CategoryService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper,
    private fb: FormBuilder,
  ) {
    super();

    this.buildForm();
    this.loading = this.categoryService.loading;

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
      categoryName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]]
    });
  }

  // ===============================
  // GETTERS
  // ===============================
  get categoryNameCtrl() {
    return this.form.get('categoryName')!;
  }

  // ======================================================
  // BASE CLASS IMPLEMENTATIONS
  // ======================================================
  protected override getId(item: CategoryReadModel): number | null {
    return item.categoryID ?? null;
  }

  protected override loadItems(): void {
    const params = this.requestParams();

    this.categoryService
      .getCategoryPaged(
        params.pageNumber,
        params.pageSize,
        params.searchKey
      )
      .subscribe(res => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }

  protected override loadToForm(item: CategoryReadModel, mode: DashboardModeEnum): void {
    this.selectedItemId.set(item.categoryID ?? null);

    this.form.patchValue({
      categoryName: item.categoryName
    });

    mode === DashboardModeEnum.VIEW
      ? this.form.disable()
      : this.form.enable();

    this.formMode.set(mode);
  }
  protected override resetForm(): void {
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
    this.confirmationHelper.confirmSave('category').subscribe(confirmed => {
      if (!confirmed) return;

      const payload: CategoryCreateUpdateModel = this.form.getRawValue();

      this.categoryService.create(payload).subscribe({
        next: () => {
          this.messageService.success('Category saved successfully');
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

    this.confirmationHelper.confirmUpdate('category').subscribe(confirmed => {
      if (!confirmed) return;

      const payload: CategoryCreateUpdateModel = {
        ...this.form.getRawValue()
      }

      this.categoryService.update(id, payload).subscribe({
        next: () => {
          this.messageService.success('Category updated successfully');
          this.resetForm();
          this.loadItems();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Update failed');
        }
      });
    });
  }

  delete(category: CategoryReadModel): void {
    this.confirmationHelper.confirmDelete('category').subscribe(confirmed => {
      if (!confirmed) return;

      this.categoryService.delete(category.categoryID!).subscribe({
        next: () => {
          this.messageService.success('Category deleted successfully');
          this.loadItems();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Delete failed');
        }
      });
    });
  }
}
