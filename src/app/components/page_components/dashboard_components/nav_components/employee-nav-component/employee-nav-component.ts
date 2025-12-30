import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { DashboardNavStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavStateBase';
import { DashboardModeEnum } from '../../../../../config/enums/dashboardModeEnum';
import { EmployeeService } from '../../../../../services/api_services/employeeService';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { CrudOperationConfirmationUiHelper } from '../../../../../utils/crudOperationConfirmationUiHelper';
import { DashboardTableColumnModel } from '../../../../../models/ui_models/dashboardTableColumnModel';
import { EmployeePositionEnum } from '../../../../../config/enums/employeePositionEnum';
import { UserRoleEnum } from '../../../../../config/enums/userRoleEnum';
import { DashboardFormComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-form-component/dashboard-form-component';
import { DashboardTableComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-table-component/dashboard-table-component';
import { EmployeePositionUiModel } from '../../../../../models/ui_models/employeePositionUiModel';
import { EmployeeCreateModel } from '../../../../../models/api_models/create_update_models/create_models/employee_create_Model';
import { EmployeeReadModel } from '../../../../../models/api_models/read_models/employee_read_Model';
import { EmployeeUpdateModel } from '../../../../../models/api_models/create_update_models/update_models/employee_update_Model';

@Component({
  selector: 'app-employee-nav-component',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    DashboardFormComponent,
    DashboardTableComponent
  ],
  templateUrl: './employee-nav-component.html',
  styleUrl: './employee-nav-component.scss',
})
export class EmployeeNavComponent extends DashboardNavStateBase<EmployeeReadModel> {



  // ======================================================
  // COMPONENT SPECIFIC THINGS
  // ======================================================
  employeePositions = signal<EmployeePositionUiModel[]>([]);
  selectedEmployeePositionId = signal<number | undefined>(undefined);

  selectedPositionName = computed(() => {
    const id = this.selectedEmployeePositionId();
    return id ? EmployeePositionEnum[id] : undefined;
  });

  override requestParams = computed(() => ({
    pageNumber: this.pageNumber(),
    pageSize: this.pageSize(),
    positionId: this.selectedEmployeePositionId(),
    searchKey: this.searchText() || undefined,
  }));

  private loadEmployeePositions(): void {
    const positions = Object.values(EmployeePositionEnum)
      .filter(v => typeof v === 'number')
      .map(v => ({
        positionID: v as number,
        positionName: EmployeePositionEnum[v]
      }));

    this.employeePositions.set(positions);
  }

  onEmployeePositionSelect(id?: number) {
    this.pageNumber.set(1);
    this.selectedEmployeePositionId.set(id);
  }

  isCreateMode(): boolean {
    return this.formMode() === DashboardModeEnum.CREATE;
  }

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
  columns: DashboardTableColumnModel<EmployeeReadModel>[] = [
    {
      key: 'employeeName',
      header: 'Name',
      cell: em => em.employeeName
    },
    {
      key: 'position',
      header: 'Position',
      cell: em => EmployeePositionEnum[em.position!]
    },
    {
      key: 'email',
      header: 'Email',
      cell: em => em.user!.email
    },
    {
      key: 'createdAt',
      header: 'Created',
      cell: em => new Date(em.createdAt!).toLocaleString()
    }
  ];

  displayedColumns = ['employeeName', 'position', 'email', 'createdAt', 'actions'];

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private employeeService: EmployeeService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper,
    private fb: FormBuilder,
  ) {
    super();

    this.buildForm();
    this.loading = this.employeeService.loading;

    // Load static data
    this.loadEmployeePositions();

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
      employeeName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required], 
      role: [UserRoleEnum.Employee, Validators.required],
      position: ['', Validators.required]
    });
  }

  // ===============================
  // GETTERS
  // ===============================
  get employeeNameCtrl() {
    return this.form.get('employeeName')!;
  }

  get emailCtrl() {
    return this.form.get('email')!;
  }

  get passwordCtrl() {
    return this.form.get('password')!;
  }

  // ======================================================
  // BASE CLASS IMPLEMENTATIONS
  // ======================================================
  protected override getId(item: EmployeeReadModel): number | null {
    return item.employeeID ?? null;
  }

  protected override loadItems(): void {
    const params = this.requestParams();

    this.employeeService
      .getEmployeePaged(
        params.pageNumber,
        params.pageSize,
        params.positionId,
        params.searchKey
      )
      .subscribe(res => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }

  protected override loadToForm(item: EmployeeReadModel, mode: DashboardModeEnum): void {
    this.selectedItemId.set(item.employeeID ?? null);

    this.form.patchValue({
      email: item.user?.email,
      employeeName: item.employeeName,
      position: item.position
    });

    // EMAIL & PASSWORD NOT REQUIRED IN EDIT / VIEW
    this.emailCtrl.clearValidators();
    this.emailCtrl.updateValueAndValidity();
    this.passwordCtrl.clearValidators();
    this.passwordCtrl.updateValueAndValidity();

    mode === DashboardModeEnum.VIEW
      ? this.form.disable()
      : this.form.enable();

    this.formMode.set(mode);
  }

  protected override resetForm(): void {
    this.submitted = false;
    this.formDirective.resetForm();

    // EMAIL & PASSWORD REQUIRED ONLY FOR CREATE
    this.emailCtrl.setValidators([Validators.required]);
    this.emailCtrl.updateValueAndValidity();
    this.passwordCtrl.setValidators([Validators.required]);
    this.passwordCtrl.updateValueAndValidity();

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
    this.confirmationHelper.confirmSave('employee').subscribe(confirmed => {
      if (!confirmed) return;

      const payload: EmployeeCreateModel = {
        employeeName: this.form.value.employeeName,
        position: this.form.value.position,

        user: {
          email: this.form.value.email,
          password: this.form.value.password,
          role: this.form.value.role as UserRoleEnum
        }
      };

      this.employeeService.create(payload).subscribe({
        next: () => {
          this.messageService.success('Employee saved successfully');
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

    const raw = this.form.getRawValue();

    this.confirmationHelper.confirmUpdate('employee').subscribe(confirmed => {
      if (!confirmed) return;

      const payload: EmployeeUpdateModel = {
        employeeName: raw.employeeName,
        position: raw.position,
      }

      this.employeeService.update(id, payload).subscribe({
        next: () => {
          this.messageService.success('Employee updated successfully');
          this.resetForm();
          this.loadItems();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Update failed');
        }
      });
    });
  }

  delete(employee: EmployeeReadModel): void {
    this.confirmationHelper.confirmDelete('employee').subscribe(confirmed => {
      if (!confirmed) return;

      this.employeeService.delete(employee.employeeID!).subscribe({
        next: () => {
          this.messageService.success('employee deleted successfully');
          this.loadItems();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Delete failed');
        }
      });
    });
  }
}
