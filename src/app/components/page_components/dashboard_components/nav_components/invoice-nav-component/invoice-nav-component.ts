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
  customerID = 0;

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
    customerId: this.customerID || undefined,
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
    // cusyomer name
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
    private invoiceService: InvoiceService,
    private auth: AuthSessionService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper,
  ) {
    super();

    this.customerID = this.auth.customerID()!;

    this.loading = this.invoiceService.loading;

    // Load static data
    this.loadInvoiceTypes();
    this.loadInvoiceStatuses();

    // Auto reload when paging / search changes
    effect(() => {
      this.requestParams();
      this.loadItems();
    });
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
}
