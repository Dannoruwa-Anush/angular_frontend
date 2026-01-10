import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { DashboardTableComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-table-component/dashboard-table-component';
import { InvoiceStatusEnum } from '../../../../../config/enums/invoiceStatusEnum';
import { DashboardNavStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavStateBase';
import { InvoiceReadModel } from '../../../../../models/api_models/read_models/invoiceReadModel';
import { DashboardModeEnum } from '../../../../../config/enums/dashboardModeEnum';
import { InvoiceTypeUiModel } from '../../../../../models/ui_models/invoiceTypeStatusUiModel';
import { InvoiceTypeEnum } from '../../../../../config/enums/invoiceTypeEnum';
import { DashboardTableColumnModel } from '../../../../../models/ui_models/dashboardTableColumnModel';
import { InvoiceService } from '../../../../../services/api_services/invoiceService';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { AuthSessionService } from '../../../../../services/auth_services/authSessionService';
import { CrudOperationConfirmationUiHelper } from '../../../../../utils/crudOperationConfirmationUiHelper';
import { InvoiceStatusUiModel } from '../../../../../models/ui_models/invoiceStatusUiModel';
import { FileService } from '../../../../../services/ui_service/fileService';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceViewDialogBoxComponent } from '../../../../reusable_components/dialog_boxes/invoice-view-dialog-box-component/invoice-view-dialog-box-component';
import { UserRoleEnum } from '../../../../../config/enums/userRoleEnum';
import { EmployeePositionEnum } from '../../../../../config/enums/employeePositionEnum';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoice-nav-component',
  imports: [
    MaterialModule,
    CommonModule,
    DashboardTableComponent
  ],
  templateUrl: './invoice-nav-component.html',
  styleUrl: './invoice-nav-component.scss',
})
export class InvoiceNavComponent extends DashboardNavStateBase<InvoiceReadModel> {





  // ======================================================
  // COMPONENT SPECIFIC THINGS
  // ======================================================
  customerId = computed(() => this.auth.customerID());

  InvoiceTypeEnum = InvoiceTypeEnum;

  invoiceTypes = signal<InvoiceTypeUiModel[]>([]);
  selectedInvoiceTypeId = signal<number | undefined>(undefined);

  selectedInvoiceTypeName = computed(() => {
    const id = this.selectedInvoiceTypeId();
    return id ? InvoiceTypeEnum[id] : undefined;
  });

  private loadInvoiceTypes(): void {
    const invoiceType = Object.values(InvoiceTypeEnum)
      .filter(v => typeof v === 'number')
      .map(v => ({
        invoiceTypeID: v as number,
        invoiceTypeName: InvoiceTypeEnum[v]
      }));

    this.invoiceTypes.set(invoiceType);
  }

  onInvoiceTypeSelect(id?: number) {
    this.pageNumber.set(1);
    this.selectedInvoiceTypeId.set(id);
  }

  InvoiceStatusEnum = InvoiceStatusEnum;

  invoiceStatuses = signal<InvoiceStatusUiModel[]>([]);
  selectedInvoiceStatusId = signal<number | undefined>(undefined);

  selectedInvoiceStatusName = computed(() => {
    const id = this.selectedInvoiceStatusId();
    return id ? InvoiceStatusEnum[id] : undefined;
  });

  private loadInvoiceStatuses(): void {
    const invoiceStatus = Object.values(InvoiceStatusEnum)
      .filter(v => typeof v === 'number')
      .map(v => ({
        invoiceStatusID: v as number,
        invoiceStatusName: InvoiceStatusEnum[v]
      }));

    this.invoiceStatuses.set(invoiceStatus);
  }

  onInvoiceStatusSelect(id?: number) {
    this.pageNumber.set(1);
    this.selectedInvoiceStatusId.set(id);
  }

  override requestParams = computed(() => ({
    pageNumber: this.pageNumber(),
    pageSize: this.pageSize(),
    invoiceTypeId: this.selectedInvoiceTypeId(),
    invoiceStatusId: this.selectedInvoiceStatusId(),
    customerId: this.customerId() || undefined,
    searchKey: this.searchText() || undefined,
  }));

  selectedInvoice = signal<InvoiceReadModel | null>(null);

  // ======================================================
  // TABLE CONFIG
  // ======================================================
  columns: DashboardTableColumnModel<InvoiceReadModel>[] = [
    {
      key: 'invoiceID',
      header: 'Invoice No',
      cell: i => i.invoiceID
    },
    // customer name
    {
      key: 'invoiceAmount',
      header: 'Amount',
      cell: i => i.invoiceAmount
    },
    {
      key: 'invoiceType',
      header: 'Type',
      cell: i => InvoiceTypeEnum[i.invoiceType]
    },
    {
      key: 'invoiceStatus',
      header: 'Status',
      cell: i => InvoiceStatusEnum[i.invoiceStatus]
    },
    //created at
  ];

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private fileService: FileService,
    private invoiceService: InvoiceService,
    private auth: AuthSessionService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper,
  ) {
    super();

    this.loading = this.invoiceService.loading;

    // Load static data
    this.loadInvoiceTypes();
    this.loadInvoiceStatuses();

    // Set default invoice status for Customer or Cashier
    if (this.isCustomer() || this.auth.hasEmployeePosition([EmployeePositionEnum.Cashier])) {
      this.selectedInvoiceStatusId.set(InvoiceStatusEnum.Unpaid);
    }

    this.handleRedirectReason();

    // Auto reload when paging / search changes
    effect(() => {
      this.requestParams();
      this.loadItems();
    });
  }

  // ======================================================
  // HELPERS
  // ======================================================
  private handleRedirectReason(): void {
    const reason = this.route.snapshot.queryParamMap.get('reason');

    if (reason === 'unpaid') {
      this.messageService.warning(
        'You have unpaid invoices. Please settle them before placing a new order.'
      );

      // Remove query param so message shows only once
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });
    }
  }

  isCustomer(): boolean {
    return this.auth.role() === UserRoleEnum.Customer;
  }

  getRowClass(invoice: InvoiceReadModel): string {
    switch (invoice.invoiceStatus) {
      case InvoiceStatusEnum.Unpaid: return 'row-unpaid';
      case InvoiceStatusEnum.Paid: return 'row-paid';
      case InvoiceStatusEnum.Voided: return 'row-voided';
      default: return 'row-default';
    }
  }

  // ======================================================
  // BASE CLASS IMPLEMENTATIONS
  // ======================================================
  protected override getId(item: InvoiceReadModel): number | null {
    return item.invoiceID ?? null;
  }
  protected override loadItems(): void {
    const params = this.requestParams();

    this.invoiceService
      .getInvoicePaged(
        params.pageNumber,
        params.pageSize,
        params.invoiceTypeId,
        params.invoiceStatusId,
        params.customerId,
        params.searchKey
      )
      .subscribe(res => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }
  protected override loadToForm(
    item: InvoiceReadModel,
    mode: DashboardModeEnum
  ): void {
    //this.openInvoiceDialog(item);
  }

  protected override resetForm(): void {
    throw new Error('Method not implemented.');
  }

  override view(item: InvoiceReadModel) {
    const invoiceUrl = this.fileService.getInvoiceFileUrl(item);

    const dialogRef = this.dialog.open(InvoiceViewDialogBoxComponent, {
      width: '90%',
      maxWidth: '1200px',
      height: '90vh',
      data: { invoice: { ...item, invoiceFileUrl: invoiceUrl } },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (result.action === 'pay') {
        console.log('Pay invoice', result.invoice.invoiceID);
        // TODO: Call your API to pay invoice
        this.loadItems();
      }

      if (result.action === 'cancel') {
        console.log('Cancel invoice', result.invoice.invoiceID);
        // TODO: Call your API to cancel invoice
        this.loadItems();
      }
    });
  }
}
