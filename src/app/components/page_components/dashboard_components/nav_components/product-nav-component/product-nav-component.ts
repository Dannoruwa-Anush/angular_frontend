import { Component, computed, effect, signal, ViewChild } from '@angular/core';
import { DashboardNavStateBase } from '../../../../reusable_components/dashboard_nav_component/dashboardNavStateBase';
import { DashboardModeEnum } from '../../../../../config/enums/dashboardModeEnum';
import { ElectronicItemService } from '../../../../../services/api_services/electronicItemService';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { SystemMessageService } from '../../../../../services/ui_service/systemMessageService';
import { CrudOperationConfirmationUiHelper } from '../../../../../utils/crudOperationConfirmationUiHelper';
import { DashboardTableColumnModel } from '../../../../../models/ui_models/dashboardTableColumnModel';
import { BrandService } from '../../../../../services/api_services/brandService';
import { CategoryService } from '../../../../../services/api_services/categoryService';
import { environment } from '../../../../../config/environment';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../custom_modules/material/material-module';
import { DashboardFormComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-form-component/dashboard-form-component';
import { DashboardTableComponent } from '../../../../reusable_components/dashboard_nav_component/dashboard_building_blocks/dashboard-table-component/dashboard-table-component';
import { BrandReadModel } from '../../../../../models/api_models/read_models/brand_read_Model';
import { CategoryReadModel } from '../../../../../models/api_models/read_models/category_read_Model';
import { ElectronicItemReadModel } from '../../../../../models/api_models/read_models/electronicItem_read_Model';
import { ElectronicItemCreateUpdateModel } from '../../../../../models/api_models/create_update_models/electronicItem_create_update_Model';

@Component({
  selector: 'app-product-nav-component',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    DashboardFormComponent,
    DashboardTableComponent
  ],
  templateUrl: './product-nav-component.html',
  styleUrl: './product-nav-component.scss',
})
export class ProductNavComponent extends DashboardNavStateBase<ElectronicItemReadModel> {




  // ======================================================
  // COMPONENT SPECIFIC THINGS
  // ======================================================
  imagePreview: string | ArrayBuffer | null = null;

  brands = signal<BrandReadModel[]>([]);
  categories = signal<CategoryReadModel[]>([]);

  selectedBrandId = signal<number | undefined>(undefined);
  selectedCategoryId = signal<number | undefined>(undefined);

  selectedBrandName = computed(() =>
    this.brands().find(b => b.brandID === this.selectedBrandId())?.brandName
  );

  selectedCategoryName = computed(() =>
    this.categories().find(c => c.categoryID === this.selectedCategoryId())?.categoryName
  );

  override requestParams = computed(() => ({
    pageNumber: this.pageNumber(),
    pageSize: this.pageSize(),
    brandId: this.selectedBrandId(),
    categoryId: this.selectedCategoryId(),
    searchKey: this.searchText() || undefined,
  }));

  private loadBrands(): void {
    this.brandService.getAll().subscribe(res => {
      this.brands.set(res);
    });
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe(res => {
      this.categories.set(res);
    });
  }

  onBrandSelect(id?: number) {
    this.pageNumber.set(1);
    this.selectedBrandId.set(id);
  }

  onCategorySelect(id?: number) {
    this.pageNumber.set(1);
    this.selectedCategoryId.set(id);
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // put the File object into the form
    this.form.patchValue({
      imageFile: file
    });

    this.form.get('imageFile')?.updateValueAndValidity();

    // preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  private baseUrl = environment.BASE_API_URL.replace(/\/$/, '');

  getImageUrl(item: ElectronicItemReadModel): string {
    if (item.electronicItemImageUrl) {
      return item.electronicItemImageUrl;
    }
    if (item.electronicItemImage) {
      return `${this.baseUrl}/${item.electronicItemImage}`;
    }
    return 'assets/images/no-image.png';
  }

  // ======================================================
  // FORM
  // ======================================================
  form!: FormGroup;
  submitted = false;

  @ViewChild(FormGroupDirective)
  private formDirective!: FormGroupDirective;

  // ======================================================
  // TABLE CONFIG
  // ======================================================
  columns: DashboardTableColumnModel<ElectronicItemReadModel>[] = [
    {
      key: 'electronicItemName',
      header: 'Name',
      cell: e => e.electronicItemName
    },
    {
      key: 'price',
      header: 'Price (Rs.)',
      cell: e => e.price
    },
    {
      key: 'qoh',
      header: 'QOH',
      cell: e => e.qoh
    },
    {
      key: 'brandName',
      header: 'Brand',
      cell: e => e.brandResponseDto!.brandName
    },
    {
      key: 'categoryName',
      header: 'Category',
      cell: e => e.categoryResponseDto!.categoryName
    },
  ];

  displayedColumns = ['electronicItemName', 'price', 'qoh', 'brandName', 'categoryName'];

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService,
    private electronicItemService: ElectronicItemService,
    private messageService: SystemMessageService,
    private confirmationHelper: CrudOperationConfirmationUiHelper,
    private fb: FormBuilder,
  ) {
    super();

    this.buildForm();
    this.loading = this.electronicItemService.loading;

    // Load static data
    this.loadBrands();
    this.loadCategories();

    // Auto reload when paging / search changes
    effect(() => {
      this.requestParams();
      this.loadItems();
    });
  }

  // ======================================================
  // REACTIVE FORM SETUP
  // ======================================================
  private buildForm(): void {
    this.form = this.fb.group({
      electronicItemName: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      qoh: ['', [Validators.required, Validators.min(0)]],
      imageFile: [null as File | null],
      brandID: ['', Validators.required],
      categoryID: ['', Validators.required],
    });
  }

  // ===============================
  // GETTERS
  // ===============================
  get electronicItemNameCtrl() {
    return this.form.get('electronicItemName')!;
  }

  // ======================================================
  // BASE CLASS IMPLEMENTATIONS
  // ======================================================
  protected override getId(item: ElectronicItemReadModel): number | null {
    return item.electronicItemID ?? null;
  }
  protected override loadItems(): void {
    const params = this.requestParams();

    this.electronicItemService
      .getElectronicItemPaged(
        params.pageNumber,
        params.pageSize,
        params.categoryId,
        params.brandId,
        params.searchKey
      )
      .subscribe(res => {
        this.items.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }

  protected override loadToForm(item: ElectronicItemReadModel, mode: DashboardModeEnum): void {
    this.selectedItemId.set(item.electronicItemID ?? null);

    this.form.patchValue({
      electronicItemName: item.electronicItemName,
      price: item.price,
      qoh: item.qoh,
      brandID: item.brandResponseDto?.brandID,
      categoryID: item.categoryResponseDto?.categoryID,
    });

    this.imagePreview = this.getImageUrl(item);
    mode === DashboardModeEnum.VIEW ? this.form.disable() : this.form.enable();
    this.formMode.set(mode);
  }

  protected override resetForm(): void {
    this.submitted = false;
    this.formDirective.resetForm();
    this.imagePreview = null;
    this.form.enable();
    this.selectedItemId.set(null);
    this.formMode.set(DashboardModeEnum.CREATE);
  }

  // ===============================
  // SUBMIT
  // ===============================
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid || this.isViewMode()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isEditMode() ? this.update() : this.save();
  }

  // ======================================================
  // CRUD OPERATIONS
  // ======================================================
  save(): void {
    this.confirmationHelper.confirmSave('product').subscribe(confirmed => {
      if (!confirmed) return;

      const payload: ElectronicItemCreateUpdateModel = this.form.getRawValue();

      this.electronicItemService.create(payload).subscribe({
        next: () => {
          this.messageService.success('Product saved successfully');
          this.resetForm();
          this.loadItems();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Save failed');
        }
      });
    });
  }

  update(): void {
    const id = this.selectedItemId();
    if (!id) return;

    this.confirmationHelper.confirmUpdate('product').subscribe(confirmed => {
      if (!confirmed) return;

      const payload: ElectronicItemCreateUpdateModel = {
        ...this.form.getRawValue()
      }

      this.electronicItemService.update(id, payload).subscribe({
        next: () => {
          this.messageService.success('Product updated successfully');
          this.resetForm();
          this.loadItems();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Update failed');
        }
      });
    });
  }

  delete(item: ElectronicItemReadModel): void {
    this.confirmationHelper.confirmDelete('product').subscribe(confirmed => {
      if (!confirmed) return;

      this.electronicItemService.delete(item.electronicItemID!).subscribe({
        next: () => {
          this.messageService.success('Product deleted successfully');
          this.loadItems();
        },
        error: err => {
          this.messageService.error(err?.error?.message || 'Delete failed');
        }
      });
    });
  }
}
