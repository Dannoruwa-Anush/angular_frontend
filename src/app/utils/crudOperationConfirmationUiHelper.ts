import { Injectable } from "@angular/core";

import { SystemOperationConfirmService } from "../services/ui_service/systemOperationConfirmService";
import { ConfirmRadioOptionUiModel } from "../models/ui_models/confirmRadioOptionUiModel";

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

  confirmProcessWithInput(
    title: string,
    message: string,
    inputPlaceholder = 'Enter value',
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) {
    return this.confirmService.confirm({
      title,
      message,
      confirmText,
      cancelText,
      inputConfig: {
        placeholder: inputPlaceholder,
        required: true
      }
    });
  }

  confirmProcessWithRadio<T>(
    title: string,
    message: string,
    options: ConfirmRadioOptionUiModel<T>[],
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) {
    return this.confirmService.confirm({
      title,
      message,
      confirmText,
      cancelText,
      radioConfig: {
        options,
        required: true
      }
    });
  }
}