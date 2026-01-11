import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

// shared action service between parent (BaseOrderSubmitWizardComponent) & child (wizard steps)
@Injectable({ providedIn: 'root' })
export class OrderSubmitWizardActionService {
    confirm$ = new Subject<void>();
    cancel$ = new Subject<void>();

    confirm() {
        this.confirm$.next();
    }

    cancel() {
        this.cancel$.next();
    }
}