import { Component, effect, ViewChild } from '@angular/core';
import { BnplPlanTypeReadModel } from '../../../../../models/api_models/read_models/bnplPlanType_read_Model';
import { DashboardNavStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavStateBase';
import { DashboardModeEnum } from '../../../../../config/enums/dashboardModeEnum';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { DashboardTableColumnModel } from '../../../../../models/ui_models/dashboardTableColumnModel';
import { BnplPlanTypeService } from '../../../../../services/api_services/bnplPlanTypeService';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { CrudOperationConfirmationUiHelper } from '../../../../../utils/crudOperationConfirmationUiHelper';
import { BnplPlanTypeCreateUpdateModel } from '../../../../../models/api_models/create_update_models/bnplPlanType_create_update_Model';
import { DashboardFormComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-form-component/dashboard-form-component';
import { DashboardTableComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-table-component/dashboard-table-component';

@Component({
  selector: 'app-bnpl-plan-type-nav-component',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    DashboardFormComponent,
    DashboardTableComponent
  ],
  templateUrl: './bnpl-plan-type-nav-component.html',
  styleUrl: './bnpl-plan-type-nav-component.scss',
})
export class BnplPlanTypeNavComponent extends DashboardNavStateBase<BnplPlanTypeReadModel> {




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
  columns: DashboardTableColumnModel<BnplPlanTypeReadModel>[] = [
    {
      key: 'bnpl_PlanTypeName',
      header: 'Name',
      cell: p => p.bnpl_PlanTypeName
    },
    {
      key: 'bnpl_DurationDays',
      header: 'Duration (In days)',
      cell: p => p.bnpl_DurationDays
    },
    {
      key: 'interestRate',
      header: 'Interest Rate',
      cell: p => p.interestRate
    },
    {
      key: 'latePayInterestRatePerDay',
      header: 'Late Pay Interest Rate (Per day)',
      cell: p => p.latePayInterestRatePerDay
    },
    {
      key: 'bnpl_Description',
      header: 'Description',
      cell: p => p.bnpl_Description
    }
  ];

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private bnplPlanTypeService: BnplPlanTypeService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper,
    private fb: FormBuilder,
  ) {
    super();

    this.buildForm();
    this.loading = this.bnplPlanTypeService.loading;

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
      bnpl_PlanTypeName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      bnpl_DurationDays: ['', [Validators.required, Validators.min(1)]],
      interestRate: ['', [Validators.required, Validators.min(0)]],
      latePayInterestRatePerDay: ['', [Validators.required, Validators.min(0)]],
      bnpl_Description: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
    });
  }

  // ===============================
  // GETTERS
  // ===============================
  get bnpl_PlanTypeNameCtrl() {
    return this.form.get('bnpl_PlanTypeName')!;
  }

  get bnpl_DurationDaysCtrl() {
    return this.form.get('bnpl_DurationDays')!;
  }

  get interestRateCtrl() {
    return this.form.get('interestRate')!;
  }

  get latePayInterestRatePerDayCtrl() {
    return this.form.get('latePayInterestRatePerDay')!;
  }

  get bnpl_DescriptionCtrl() {
    return this.form.get('bnpl_Description')!;
  }

  // ======================================================
  // BASE CLASS IMPLEMENTATIONS
  // ======================================================
  protected override getId(item: BnplPlanTypeReadModel): number | null {
    return item.bnpl_PlanTypeID ?? null;
  }

  protected override loadItems(): void {
    const params = this.requestParams();

    this.bnplPlanTypeService
      .getBnplPlanTypePaged(
        params.pageNumber,
        params.pageSize,
        params.searchKey
      )
      .subscribe(res => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }

  protected override loadToForm(item: BnplPlanTypeReadModel, mode: DashboardModeEnum): void {
    this.selectedItemId.set(item.bnpl_PlanTypeID ?? null);

    this.form.patchValue({
      bnpl_PlanTypeName: item.bnpl_PlanTypeName,
      bnpl_DurationDays: item.bnpl_DurationDays,
      interestRate: item.interestRate,
      latePayInterestRatePerDay: item.latePayInterestRatePerDay,
      bnpl_Description: item.bnpl_Description,
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
    this.confirmationHelper.confirmSave('bnpl plan type').subscribe(confirmed => {
      if (!confirmed) return;

      const payload: BnplPlanTypeCreateUpdateModel = this.form.getRawValue();

      this.bnplPlanTypeService.create(payload).subscribe({
        next: () => {
          this.messageService.success('Bnpl plan type saved successfully');
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

    this.confirmationHelper.confirmUpdate('bnpl plan type').subscribe(confirmed => {
      if (!confirmed) return;

      const payload: BnplPlanTypeCreateUpdateModel = {
        ...this.form.getRawValue()
      }

      this.bnplPlanTypeService.update(id, payload).subscribe({
        next: () => {
          this.messageService.success('Bnpl plan type updated successfully');
          this.resetForm();
          this.loadItems();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Update failed');
        }
      });
    });
  }

  delete(plan: BnplPlanTypeReadModel): void {
    this.confirmationHelper.confirmDelete('bnpl plan type').subscribe(confirmed => {
      if (!confirmed) return;

      this.bnplPlanTypeService.delete(plan.bnpl_PlanTypeID!).subscribe({
        next: () => {
          this.messageService.success('Bnpl plan type deleted successfully');
          this.loadItems();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Delete failed');
        }
      });
    });
  }
}
