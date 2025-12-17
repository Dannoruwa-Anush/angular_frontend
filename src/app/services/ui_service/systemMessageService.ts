import { Injectable } from "@angular/core";

import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({ providedIn: 'root' })
export class SystemMessageService {

  private defaultConfig: MatSnackBarConfig = {
    duration: 4000, // 4 seconds
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };

  constructor(
    private snackBar: MatSnackBar
  ) { }

  success(message: string) {
    this.show(message, 'snackbar-success');
  }

  error(message: string) {
    this.show(message, 'snackbar-error');
  }

  info(message: string) {
    this.show(message, 'snackbar-info');
  }

  private show(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      panelClass: [panelClass],
    });
  }

  clear() {
    this.snackBar.dismiss();
  }
}
