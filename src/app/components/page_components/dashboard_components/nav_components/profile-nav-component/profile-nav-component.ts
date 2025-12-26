import { Component, computed, signal, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardFormComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-form-component/dashboard-form-component';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { CrudOperationConfirmationUiHelper } from '../../../../../utils/crudOperationConfirmationUiHelper';
import { EmployeeService } from '../../../../../services/api_services/employeeService';
import { CustomerService } from '../../../../../services/api_services/customerService';
import { AuthSessionService } from '../../../../../services/auth_services/authSessionService';
import { DashboardModeEnum } from '../../../../../config/enums/dashboardModeEnum';
import { UserRoleEnum } from '../../../../../config/enums/userRoleEnum';
import { CustomerModel } from '../../../../../models/api_models/customerModel';
import { EmployeeModel } from '../../../../../models/api_models/employeeModel';

@Component({
  selector: 'app-profile-nav-component',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    DashboardFormComponent,
  ],
  templateUrl: './profile-nav-component.html',
  styleUrl: './profile-nav-component.scss',
})
export class ProfileNavComponent {

  UserRoleEnum = UserRoleEnum;
  DashboardModeEnum = DashboardModeEnum;
  role!: UserRoleEnum;

  // =====================
  // FORM MODE
  // =====================
  selectedItemId = signal<number | null>(null);
  formMode = signal<DashboardModeEnum>(DashboardModeEnum.CREATE);

  // =====================
  // MODE HELPERS
  // =====================
  isEditMode = computed(() => this.formMode() === DashboardModeEnum.EDIT);
  isViewMode = computed(() => this.formMode() === DashboardModeEnum.VIEW);

  // ======================================================
  // FORM
  // ======================================================
  form!: FormGroup;
  submitted = false;

  @ViewChild(FormGroupDirective)
  private formDirective!: FormGroupDirective;

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private fb: FormBuilder,
    private auth: AuthSessionService,
    private customerService: CustomerService,
    private employeeService: EmployeeService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper,
  ) {
    this.role = this.auth.role()!;
    this.buildForm();
    this.applyRoleValidators();

    this.loadProfile();
  }

  // ======================================================
  // REACTIVE FORM SETUP
  // ======================================================
  private buildForm(): void {
    this.form = this.fb.group({
      name: ['', []],
      position: [{ value: '', disabled: true }],
      phoneNo: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.maxLength(255)]],
    });
  }

  private applyRoleValidators(): void {
    // name is required for both
    this.nameCtrl.setValidators([Validators.required]);

    if (this.role === UserRoleEnum.Customer) {
      this.phoneNoCtrl.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/),
      ]);

      this.addressCtrl.setValidators([
        Validators.required,
        Validators.maxLength(255),
      ]);
    } else {
      this.phoneNoCtrl.clearValidators();
      this.addressCtrl.clearValidators();
    }

    this.nameCtrl.updateValueAndValidity();
    this.phoneNoCtrl.updateValueAndValidity();
    this.addressCtrl.updateValueAndValidity();
  }

  private enableEditableControls(): void {
    this.nameCtrl.enable();
    this.phoneNoCtrl.enable();
    this.addressCtrl.enable();

    // enforce non-editable field
    this.form.get('position')?.disable();
  }

  // ===============================
  // GETTERS
  // ===============================
  get nameCtrl() {
    return this.form.get('name')!;
  }

  get phoneNoCtrl() {
    return this.form.get('phoneNo')!;
  }

  get addressCtrl() {
    return this.form.get('address')!;
  }

  // ======================================================
  // LOAD PROFILE (ROLE AWARE)
  // ======================================================
  private loadProfile(): void {
    const userId = this.auth.userID();
    if (!userId) return;

    if (this.role === UserRoleEnum.Customer) {
      this.customerService.getByUserId(userId).subscribe({
        next: customer => this.loadCustomer(customer),
        error: () => this.setCreateMode()
      });
    }

    if (this.role === UserRoleEnum.Employee) {
      this.employeeService.getByUserId(userId).subscribe({
        next: employee => this.loadEmployee(employee),
        error: () => this.setCreateMode()
      });
    }
  }

  private loadCustomer(customer: CustomerModel): void {
    if (!customer) {
      this.setCreateMode();
      return;
    }

    this.selectedItemId.set(customer.customerID!);

    this.form.patchValue({
      name: customer.customerName,
      phoneNo: customer.phoneNo,
      address: customer.address
    });

    this.form.disable();
    this.formMode.set(DashboardModeEnum.VIEW);
  }

  private loadEmployee(employee: EmployeeModel): void {
    if (!employee) {
      this.setCreateMode();
      return;
    }

    this.selectedItemId.set(employee.employeeID!);

    this.form.patchValue({
      name: employee.employeeName,
      position: employee.position
    });

    this.form.disable();
    this.formMode.set(DashboardModeEnum.VIEW);
  }

  private setCreateMode(): void {
    this.enableEditableControls();
    this.formMode.set(DashboardModeEnum.CREATE);
  }

  enableEdit(): void {
    this.enableEditableControls();
    this.formMode.set(DashboardModeEnum.EDIT);
  }

  cancel(): void {
    this.loadProfile();
  }

  private resetForm(): void {
    this.submitted = false;
    this.formDirective.resetForm();

    this.enableEditableControls();
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
  private buildCustomerPayload(): CustomerModel {
    const raw = this.form.getRawValue();

    return {
      customerName: raw.name,
      phoneNo: raw.phoneNo,
      address: raw.address,
    };
  }

  private buildEmployeePayload(): EmployeeModel {
    const raw = this.form.getRawValue();

    return {
      employeeName: raw.name,
    };
  }

  save(): void {
    this.confirmationHelper.confirmSave('Profile').subscribe(confirmed => {
      if (!confirmed) return;

      if (this.role === UserRoleEnum.Customer) {
        this.customerService.create(this.buildCustomerPayload()).subscribe(() => {
          this.messageService.success('Profile saved successfully');
          this.resetForm();
          this.loadProfile();
        });
      }

      if (this.role === UserRoleEnum.Employee) {
        this.employeeService.create(this.buildEmployeePayload()).subscribe(() => {
          this.messageService.success('Profile saved successfully');
          this.resetForm();
          this.loadProfile();
        });
      }
    });
  }

  update(): void {
    const id = this.selectedItemId();
    if (!id) return;

    this.confirmationHelper.confirmUpdate('Profile').subscribe(confirmed => {
      if (!confirmed) return;

      if (this.role === UserRoleEnum.Customer) {
        this.customerService.update(
          id,
          { ...this.buildCustomerPayload(), customerID: id }
        ).subscribe(() => {
          this.messageService.success('Profile updated successfully');
          this.resetForm();
          this.loadProfile();
        });
      }

      if (this.role === UserRoleEnum.Employee) {
        this.employeeService.update(
          id,
          { ...this.buildEmployeePayload(), employeeID: id }
        ).subscribe(() => {
          this.messageService.success('Profile updated successfully');
          this.resetForm();
          this.loadProfile();
        });
      }
    });
  }
}