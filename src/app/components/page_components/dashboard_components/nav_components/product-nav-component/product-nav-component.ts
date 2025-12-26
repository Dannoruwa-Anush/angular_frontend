import { Component } from '@angular/core';
import { DashboardNavStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavStateBase';
import { ElectronicItemModel } from '../../../../../models/api_models/electronicItemModel';
import { DashboardModeEnum } from '../../../../../config/enums/dashboardModeEnum';
import { ElectronicItemService } from '../../../../../services/api_services/electronicItemService';
import { FormBuilder } from '@angular/forms';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { CrudOperationConfirmationUiHelper } from '../../../../../utils/crudOperationConfirmationUiHelper';

@Component({
  selector: 'app-product-nav-component',
  imports: [],
  templateUrl: './product-nav-component.html',
  styleUrl: './product-nav-component.scss',
})
export class ProductNavComponent extends DashboardNavStateBase<ElectronicItemModel> {




  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private electronicItemService: ElectronicItemService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper,
    private fb: FormBuilder,
  )
  {
    super();
  }
  
  // ======================================================
  // BASE CLASS IMPLEMENTATIONS
  // ======================================================
  protected override getId(item: ElectronicItemModel): number | null {
    throw new Error('Method not implemented.');
  }
  protected override loadItems(): void {
    throw new Error('Method not implemented.');
  }
  protected override loadToForm(item: ElectronicItemModel, mode: DashboardModeEnum): void {
    throw new Error('Method not implemented.');
  }
  protected override resetForm(): void {
    throw new Error('Method not implemented.');
  }
}
