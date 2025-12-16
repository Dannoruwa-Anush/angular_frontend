export interface ShoppingCartItemModel {
  productId: number;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
  subtotal: number;
}