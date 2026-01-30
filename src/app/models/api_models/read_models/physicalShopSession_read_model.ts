export interface PhysicalShopSessionReadModel {
  physicalShopSessionID : number;
  openedAt ?: string;
  closedAt ?: string;
  isActive : boolean;
}