import { CommonModule } from '@angular/common';
import { Component, effect, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { DashboardNavStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavStateBase';
import { EmployeeModel } from '../../../../../models/api_models/employeeModel';
import { DashboardModeEnum } from '../../../../../config/enums/dashboardModeEnum';
import { EmployeeService } from '../../../../../services/api_services/employeeService';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { CrudOperationConfirmationUiHelper } from '../../../../../utils/crudOperationConfirmationUiHelper';
import { DashboardTableColumnModel } from '../../../../../models/ui_models/dashboardTableColumnModel';
import { getEmployeePositionName } from '../../../../../config/enums/employeePositionEnum';
import { UserRoleEnum } from '../../../../../config/enums/userRoleEnum';

@Component({
  selector: 'app-employee-nav-component',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './employee-nav-component.html',
  styleUrl: './employee-nav-component.scss',
})
export class EmployeeNavComponent extends DashboardNavStateBase<EmployeeModel> {




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
  columns: DashboardTableColumnModel<EmployeeModel>[] = [
    {
      key: 'employeeName',
      header: 'Name',
      cell: em => em.employeeName
    },
    {
      key: 'position',
      header: 'Position',
      cell: em => getEmployeePositionName(em.position!)
    },
    {
      key: 'email',
      header: 'Email',
      cell: em => em.userResponseDto!.email
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
      email: ['', [Validators.required, Validators.email]],
      password: [123], //fixed
      role: [UserRoleEnum.Employee],  //fixed
      employeeName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      position: ['']
    });
  }
  // ======================================================
  // BASE CLASS IMPLEMENTATIONS
  // ======================================================
  protected override getId(item: EmployeeModel): number | null {
    throw new Error('Method not implemented.');
  }
  protected override loadItems(): void {
    throw new Error('Method not implemented.');
  }
  protected override loadToForm(item: EmployeeModel, mode: DashboardModeEnum): void {
    throw new Error('Method not implemented.');
  }
  protected override resetForm(): void {
    throw new Error('Method not implemented.');
  }
}
