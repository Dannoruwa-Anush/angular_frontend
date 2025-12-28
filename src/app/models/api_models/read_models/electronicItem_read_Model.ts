import { BrandReadModel } from "./brand_read_Model";
import { CategoryReadModel } from "./category_read_Model";

export interface ElectronicItemReadModel {
    electronicItemID: number;
    electronicItemName: string;
    price: number;
    qoh: number;
    electronicItemImageUrl?: string;
    electronicItemImage?: string;

    //FK: Fields
    brandResponseDto?: BrandReadModel;
    categoryResponseDto?: CategoryReadModel;
}