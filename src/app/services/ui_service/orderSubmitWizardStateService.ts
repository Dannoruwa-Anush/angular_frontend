import { Injectable, signal } from "@angular/core";
import { CustomerOrderCreateModel } from "../../models/api_models/create_update_models/create_models/customerOrder_create_Model";

@Injectable({ providedIn: 'root' })
export class OrderSubmitWizardStateService {

  private order = signal<CustomerOrderCreateModel | null>(null);

  orderDraft = this.order.asReadonly();

  init(order: CustomerOrderCreateModel) {
    this.order.set(order);
  }

  update(patch: Partial<CustomerOrderCreateModel>) {
    const current = this.order();
    if (!current) return;
    this.order.set({ ...current, ...patch });
  }

  reset() {
    this.order.set(null);
  }
}