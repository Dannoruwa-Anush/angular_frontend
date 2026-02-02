import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { DashboardTableComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-table-component/dashboard-table-component';
import { InvoiceStatusEnum } from '../../../../../config/enums/invoiceStatusEnum';
import { DashboardNavStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavStateBase';
import { InvoiceReadModel } from '../../../../../models/api_models/read_models/invoiceReadModel';
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
import { OrderSourceEnum } from '../../../../../config/enums/orderSourceEnum';

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
  // STATE
  // ======================================================
  customerId = computed(() => this.auth.customerID());

  redirectInvoiceId = signal<number | null>(null);
  selectedInvoice = signal<InvoiceReadModel | null>(null);

  InvoiceTypeEnum = InvoiceTypeEnum;
  InvoiceStatusEnum = InvoiceStatusEnum;

  invoiceTypes = signal<InvoiceTypeUiModel[]>([]);
  selectedInvoiceTypeId = signal<number | undefined>(undefined);

  invoiceStatuses = signal<InvoiceStatusUiModel[]>([]);
  selectedInvoiceStatusId = signal<number | undefined>(undefined);

  // ======================================================
  // COMPUTED
  // ======================================================
  selectedInvoiceTypeName = computed(() => {
    const id = this.selectedInvoiceTypeId();
    return id ? InvoiceTypeEnum[id] : undefined;
  });

  selectedInvoiceStatusName = computed(() => {
    const id = this.selectedInvoiceStatusId();
    return id ? InvoiceStatusEnum[id] : undefined;
  });

  override requestParams = computed(() => ({
    pageNumber: this.pageNumber(),
    pageSize: this.pageSize(),
    invoiceTypeId: this.selectedInvoiceTypeId(),
    invoiceStatusId: this.selectedInvoiceStatusId(),
    customerId: this.customerId() || undefined,
    orderSourceId: this.orderSourceId(),
    searchKey: this.searchText() || undefined,
  }));

  // ======================================================
  // TABLE CONFIG
  // ======================================================
  columns: DashboardTableColumnModel<InvoiceReadModel>[] = [
    {
      key: 'invoiceID',
      header: 'Invoice No',
      cell: i => i.invoiceID
    },
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
    }
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

    this.loadInvoiceTypes();
    this.loadInvoiceStatuses();
    this.handleRedirectParams();

    if (this.isCustomer() || this.auth.hasEmployeePosition([EmployeePositionEnum.Cashier])) {
      this.selectedInvoiceStatusId.set(InvoiceStatusEnum.Unpaid);
    }

    effect(() => {
      this.requestParams();
      this.loadItems();
    });
  }

  // ======================================================
  // INIT HELPERS
  // ======================================================
  private handleRedirectParams(): void {
    const invoiceId = this.route.snapshot.queryParamMap.get('invoiceId');
    const reason = this.route.snapshot.queryParamMap.get('reason');

    if (invoiceId) {
      this.redirectInvoiceId.set(Number(invoiceId));
    }

    if (reason === 'unpaid') {
      this.messageService.warning(
        'You have unpaid invoices. Please settle them before placing a new order.'
      );
    }

    if (invoiceId || reason) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });
    }
  }

  private loadInvoiceTypes(): void {
    this.invoiceTypes.set(
      Object.values(InvoiceTypeEnum)
        .filter(v => typeof v === 'number')
        .map(v => ({
          invoiceTypeID: v as number,
          invoiceTypeName: InvoiceTypeEnum[v]
        }))
    );
  }

  private loadInvoiceStatuses(): void {
    this.invoiceStatuses.set(
      Object.values(InvoiceStatusEnum)
        .filter(v => typeof v === 'number')
        .map(v => ({
          invoiceStatusID: v as number,
          invoiceStatusName: InvoiceStatusEnum[v]
        }))
    );
  }

  // ======================================================
  // BASE IMPLEMENTATIONS
  // ======================================================
  protected override getId(item: InvoiceReadModel): number | null {
    return item.invoiceID ?? null;
  }

  protected override loadItems(): void {
    const params = this.requestParams();
    const targetInvoiceId = this.redirectInvoiceId();

    this.invoiceService
      .getInvoicePaged(
        params.pageNumber,
        params.pageSize,
        params.invoiceTypeId,
        params.invoiceStatusId,
        params.customerId,
        params.orderSourceId,
        params.searchKey
      )
      .subscribe(res => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);

        // =============================
        // AUTO PAGINATION TO INVOICE
        // =============================
        if (targetInvoiceId) {
          const found = res.items.find(i => i.invoiceID === targetInvoiceId);

          if (found) {
            this.selectedInvoice.set(found);
            this.redirectInvoiceId.set(null);
            return;
          }

          const maxPage = Math.ceil(res.totalCount / params.pageSize);

          if (params.pageNumber < maxPage) {
            this.pageNumber.set(params.pageNumber + 1);
          } else {
            this.redirectInvoiceId.set(null);
          }
        }
      });
  }

  protected override loadToForm(): void { }
  protected override resetForm(): void { }

  // ======================================================
  // VIEW
  // ======================================================
  override view(item: InvoiceReadModel) {
    const fileUrl = this.fileService.getInvoiceFileUrl(item);

    this.dialog.open(InvoiceViewDialogBoxComponent, {
      width: '90%',
      maxWidth: '1200px',
      height: '90vh',
      data: { invoice: { ...item, invoiceFileUrl: fileUrl } },
    });
  }

  // ======================================================
  // UI HELPERS
  // ======================================================
  isCustomer(): boolean {
    return this.auth.role() === UserRoleEnum.Customer;
  }

  isCashier = computed(
    () => this.auth.employeePosition() === EmployeePositionEnum.Cashier
  );

  orderSourceId = computed<number | undefined>(() => {
    if (this.customerId()) {
      return OrderSourceEnum.OnlineShop;
    }

    if (this.isCashier()) {
      return OrderSourceEnum.PhysicalShop;
    }

    return undefined;
  });

  getRowClass(invoice: InvoiceReadModel): string {
    if (this.selectedInvoice()?.invoiceID === invoice.invoiceID) {
      return 'row-highlight';
    }

    switch (invoice.invoiceStatus) {
      case InvoiceStatusEnum.Unpaid: return 'row-unpaid';
      case InvoiceStatusEnum.Paid: return 'row-paid';
      case InvoiceStatusEnum.Voided: return 'row-voided';
      default: return 'row-default';
    }
  }

  onInvoiceTypeSelect(id?: number) {
    this.pageNumber.set(1);
    this.selectedInvoiceTypeId.set(id);
  }

  onInvoiceStatusSelect(id?: number) {
    this.pageNumber.set(1);
    this.selectedInvoiceStatusId.set(id);
  }
}