import { Component, effect, signal } from '@angular/core';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../config/environment';
import { ElectronicItemModel } from '../../../models/api_models/electronicItemModel';
import { ElectronicItemService } from '../../../services/api_services/electronicItemService';

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



  // ---------- CONFIG ----------
  private baseUrl = environment.BASE_API_URL.replace(/\/$/, '');

  // ---------- STATE ----------
  electronicItem = signal<ElectronicItemModel | null>(null);
  quantity = signal<number>(1);
  loading = signal<boolean>(false);

  constructor(
    private electronicItemService: ElectronicItemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
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
  getImageUrl(item: ElectronicItemModel): string {
    if (item.electronicItemImageUrl) {
      return item.electronicItemImageUrl;
    }
    if (item.electronicItemImage) {
      return `${this.baseUrl}/${item.electronicItemImage}`;
    }
    return 'assets/images/no-image.png';
  }

  increaseQuantity() {
    const product = this.electronicItem();
    if (!product) return;

    if (this.quantity() < product.qoh) {
      this.quantity.update(q => q + 1);
    }
  }

  decreaseQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  // ---------- Cart operation ----------
  addToCart(): void {
    const product = this.electronicItem();

    if (!product) {
      return;
    }

    // Validate quantity
    if (this.quantity() < 1 || this.quantity() > product.qoh) {
      alert('Invalid quantity');
      return;
    }

    const cartItem = {
      productId: product.electronicItemID!,
      name: product.electronicItemName,
      imageUrl: this.getImageUrl(product),
      unitPrice: product.price,
      quantity: this.quantity(),
      maxStock: product.qoh,
      subtotal: product.price * this.quantity(),
    };

    console.log('Added to cart:', cartItem);

    // TODO: Send to CartService
  }
}
