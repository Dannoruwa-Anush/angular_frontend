import { Injectable } from "@angular/core";

import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({ providedIn: 'root' })
export class SystemMessageService {

  constructor(private snackBar: MatSnackBar) { }

  success(message: string, duration = 3000) {
    this.snackBar.open(message, 'OK', {
      duration,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  error(message: string, duration = 4000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['snackbar-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  info(message: string, duration = 3000) {
    this.snackBar.open(message, 'OK', {
      duration,
      panelClass: ['snackbar-info'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  clear() {
    this.snackBar.dismiss();
  }
}
