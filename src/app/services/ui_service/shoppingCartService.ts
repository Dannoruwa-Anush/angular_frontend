import { computed, effect, Injectable, signal } from "@angular/core";
import { ShoppingCartItemModel } from "../../models/ui_models/shoppingCartItemModel";

const CART_KEY = 'cart_items';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {


    // ---------- STATE ----------
    private cart = signal<ShoppingCartItemModel[]>(this.loadCart());

    // ---------- DERIVED STATE ----------
    cartItemCount = computed(() => this.cart().length);

    cartQuantityCount = computed(() =>
        this.cart().reduce((sum, item) => sum + item.quantity, 0)
    );

    cartItems = computed(() => this.cart());

    cartTotal = computed(() =>
        this.cart().reduce((sum, item) => sum + item.subtotal, 0)
    );

    constructor() {
        // persist cart automatically
        effect(() => {
            localStorage.setItem(CART_KEY, JSON.stringify(this.cart()));
        });
    }

    // ---------- PRIVATE ----------
    private loadCart(): ShoppingCartItemModel[] {
        const data = localStorage.getItem(CART_KEY);
        return data ? JSON.parse(data) : [];
    }

    // ---------- PUBLIC API ----------
    addToCart(item: ShoppingCartItemModel): { success: boolean; message?: string } {
        const cart = this.cart();

        // duplicate check
        if (cart.some(c => c.productId === item.productId)) {
            return { success: false, message: 'Product already in cart' };
        }

        // quantity validation
        if (item.quantity < 1) {
            return { success: false, message: 'Quantity must be at least 1' };
        }

        if (item.quantity > item.maxStock) {
            return { success: false, message: 'Quantity exceeds available stock' };
        }

        this.cart.set([...cart, item]);
        return { success: true };
    }

    updateQuantity(productId: number, qty: number): { success: boolean; message?: string } {
        const cart = this.cart();
        const item = cart.find(c => c.productId === productId);

        if (!item) {
            return { success: false, message: 'Item not found in cart' };
        }

        if (qty < 1 || qty > item.maxStock) {
            return { success: false, message: 'Invalid quantity' };
        }

        item.quantity = qty;
        item.subtotal = qty * item.unitPrice;

        this.cart.set([...cart]);
        return { success: true };
    }

    removeItem(productId: number): void {
        this.cart.set(this.cart().filter(c => c.productId !== productId));
    }

    clearCart(): void {
        this.cart.set([]);
        localStorage.removeItem(CART_KEY);
    }
}