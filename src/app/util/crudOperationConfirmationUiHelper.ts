import { Injectable } from "@angular/core";

import { SystemOperationConfirmService } from "../services/ui_service/systemOperationConfirmService";

@Injectable({ providedIn: 'root' })
export class CrudOperationConfirmationUiHelper {

  constructor(
    private confirmService: SystemOperationConfirmService
  ) { }

  confirmDelete(entityName = 'item') {
    return this.confirmService.confirm({
      title: 'Delete',
      message: `Are you sure you want to delete this ${entityName}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
  }

  confirmSave(entityName = 'item') {
    return this.confirmService.confirm({
      title: 'Save',
      message: `Save this ${entityName}?`,
      confirmText: 'Save',
      cancelText: 'Cancel'
    });
  }

  confirmUpdate(entityName = 'item') {
      return this.confirmService.confirm({
      title: 'Update',
      message: `Update this ${entityName}?`,
      confirmText: 'Update',
      cancelText: 'Cancel'
    });
  }
}