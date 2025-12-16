import { Injectable, signal } from "@angular/core";

import { SystemMessageModel } from "../../models/ui_models/systemMessageModel";

@Injectable({ providedIn: 'root' })
export class SystemMessageService {

  private _message = signal<SystemMessageModel | null>(null);
  message = this._message.asReadonly();

  success(text: string) {
    this._message.set({ type: 'success', text });
  }

  error(text: string) {
    this._message.set({ type: 'error', text });
  }

  info(text: string) {
    this._message.set({ type: 'info', text });
  }

  clear() {
    this._message.set(null);
  }
}
