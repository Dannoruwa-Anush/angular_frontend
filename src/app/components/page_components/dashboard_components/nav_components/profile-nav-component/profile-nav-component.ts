import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardFormComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-form-component/dashboard-form-component';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { CrudOperationConfirmationUiHelper } from '../../../../../utils/crudOperationConfirmationUiHelper';

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
/*
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
    //private brandService: BrandService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper,
    private fb: FormBuilder,
  ) {
    //super();

    //this.buildForm();
    //this.loading = this.brandService.loading;

    // Auto reload when paging / search changes
    /*
    effect(() => {
      this.requestParams();
      this.loadItems();
    });
  
  }
    */
}
