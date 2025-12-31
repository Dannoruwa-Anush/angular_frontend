import { Component, effect, signal } from '@angular/core';

import { MaterialModule } from '../../../custom_modules/material/material-module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ElectronicItemService } from '../../../services/api_services/electronicItemService';
import { ShoppingCartService } from '../../../services/ui_service/shoppingCartService';
import { SystemOperationConfirmService } from '../../../services/ui_service/systemOperationConfirmService';
import { SystemMessageService } from '../../../services/ui_service/systemMessageService';
import { ElectronicItemReadModel } from '../../../models/api_models/read_models/electronicItem_read_Model';
import { FileService } from '../../../services/ui_service/fileService';

@Component({
  selector: 'app-product-component',
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './product-component.html',
  styleUrl: './product-component.scss',
})
export class ProductComponent {



  // ---------- STATE ----------
  electronicItem = signal<ElectronicItemReadModel | null>(null);
  quantity = signal<number>(1);
  loading = signal<boolean>(false);

  constructor(
    private electronicItemService: ElectronicItemService,
    private shoppingCartService: ShoppingCartService,
    public fileService: FileService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmService: SystemOperationConfirmService,
    private messageService: SystemMessageService
  ) {

    // Load product on route change
    effect(() => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (!id) {
        this.router.navigate(['/']);
        return;
      }
      this.loadElectronicItemById(id);
    });
  }

  // ---------- LOADERS ----------
  private loadElectronicItemById(id: number): void {
    this.loading.set(true);
    this.electronicItemService.getById(id).subscribe({
      next: (item) => {
        this.electronicItem.set(item);
        this.quantity.set(1); // reset quantity
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/not-found']);
      }
    });
  }

  // ---------- HELPERS ----------
  increaseQuantity() {
    const product = this.electronicItem();
    if (!product) return;
    if (this.quantity() < product.qoh) this.quantity.update(q => q + 1);
  }

  decreaseQuantity() {
    if (this.quantity() > 1) this.quantity.update(q => q - 1);
  }

  // ---------- Cart operation with confirmation ----------
  addToCart(): void {
    const product = this.electronicItem();
    if (!product) return;

    this.confirmService.confirm({
      title: 'Add to Cart',
      message: `Add "${product.electronicItemName}" to cart?`,
      confirmText: 'Add',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) this.performAddToCart();
    });
  }

  private performAddToCart(): void {
    const product = this.electronicItem();
    if (!product) return;

    const result = this.shoppingCartService.addToCart({
      productId: product.electronicItemID!,
      name: product.electronicItemName,
      imageUrl: this.fileService.getElectronicItemImage(product),
      unitPrice: product.price,
      quantity: this.quantity(),
      maxStock: product.qoh,
      subtotal: product.price * this.quantity(),
    });

    if (!result.success) {
      this.messageService.error(result.message ?? 'Unable to add item to cart');
      return;
    }

    this.messageService.success('Item added to cart successfully');
    this.router.navigate(['/shoppingCart']);
  }
}
