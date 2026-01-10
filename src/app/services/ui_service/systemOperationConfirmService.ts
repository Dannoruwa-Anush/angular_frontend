import { Injectable } from "@angular/core";

import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogBoxDataModel } from "../../models/ui_models/confirmDialogBoxDataModel";
import { ConfirmDialogBoxComponent } from "../../components/reusable_components/dialog_boxes/confirm-dialog-box-component/confirm-dialog-box-component";

@Injectable({ providedIn: 'root' })
export class SystemOperationConfirmService {

    constructor(private dialog: MatDialog) { }

    confirm(data: ConfirmDialogBoxDataModel) {
        return this.dialog
            .open(ConfirmDialogBoxComponent, {
                width: '350px',
                data
            })
            .afterClosed();
    }
}