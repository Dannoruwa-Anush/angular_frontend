import { Injectable, signal, WritableSignal } from "@angular/core";

import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogBoxDataModel } from "../../models/ui_models/confirmDialogBoxDataModel";
import { ConfirmDialogBoxComponent } from "../../components/reusable_components/confirm-dialog-box-component/confirm-dialog-box-component";

@Injectable({ providedIn: 'root' })
export class SystemOperationConfirmService {


    private _confirmed = signal<boolean | null>(null);
    confirmed = this._confirmed.asReadonly();

    constructor(
        private dialog: MatDialog
    ) { }

    confirm(data: ConfirmDialogBoxDataModel): void {
        const dialogRef = this.dialog.open(ConfirmDialogBoxComponent, {
            width: '350px',
            data
        });

        dialogRef.afterClosed().subscribe(result => {
            this._confirmed.set(result === true);
        });
    }

    clear(): void {
        this._confirmed.set(null);
    }
}