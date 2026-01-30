import { CommonModule } from '@angular/common';
import { Component, Signal, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { PhysicalShopSessionReadModel } from '../../../../../models/api_models/read_models/physicalShopSession_read_model';
import { PhysicalShopSessionService } from '../../../../../services/api_services/physicalShopSessionService';
import { SystemOperationConfirmService } from '../../../../../services/ui_service/systemOperationConfirmService';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';

@Component({
  selector: 'app-physical-shop-session-nav-component',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './physical-shop-session-nav-component.html',
  styleUrl: './physical-shop-session-nav-component.scss',
})
export class PhysicalShopSessionNavComponent {

  activeSession = signal<PhysicalShopSessionReadModel | null>(null);
  loading!: Signal<boolean>;

  constructor(
    private sessionService: PhysicalShopSessionService,
    private confirmService: SystemOperationConfirmService,
    private messageService: SystemMessageService
  ) { 
    this.loading = this.sessionService.loading;
  }

  isActive = () => !!this.activeSession();

  // ==========================
  // OPEN SESSION (CREATE)
  // ==========================
  activateSession(): void {
    this.confirmService.confirm({
      title: 'Open Business Session',
      message: 'Do you want to open the business session for today?',
      confirmText: 'Open Session',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (!confirmed) return;

      this.sessionService.create().subscribe({
        next: session => {
          this.activeSession.set(session);
          this.messageService.success('Business session opened successfully');
        }
      });
    });
  }

  // ==========================
  // CLOSE SESSION (UPDATE)
  // ==========================
  deactivateSession(): void {
    const session = this.activeSession();
    if (!session?.physicalShopSessionID) return;

    this.confirmService.confirm({
      title: 'Close Business Session',
      message: 'Are you sure you want to close today’s business session?',
      confirmText: 'Close Session',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (!confirmed) return;

      this.sessionService.update(session.physicalShopSessionID).subscribe({
        next: () => {
          this.activeSession.set(null);
          this.messageService.info('Business session closed');
        }
      });
    });
  }
}