import { Injectable, signal } from "@angular/core";

import { SystemMessageModel } from "../../models/ui_models/systemMessageModel";

@Injectable({ providedIn: 'root' })
export class SystemMessageService {

  private _message = signal<SystemMessageModel | null>(null);
  message = this._message.asReadonly();

  private timeoutId: number | null = null;

  success(text: string, duration = 500) {
    this.setMessage({ type: 'success', text }, duration);
  }

  error(text: string, duration = 1000) {
    this.setMessage({ type: 'error', text }, duration);
  }

  info(text: string, duration = 1000) {
    this.setMessage({ type: 'info', text }, duration);
  }

  clear() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this._message.set(null);
  }

  private setMessage(message: SystemMessageModel, duration: number) {
    // cancel any existing message
    this.clear();

    // set new message
    this._message.set(message);

    // auto-clear after timeout
    this.timeoutId = window.setTimeout(() => {
      this._message.set(null);
      this.timeoutId = null;
    }, duration);
  }
}
