import { BrandModel } from "./brandModel";
import { CategoryModel } from "./categoryModel";

export interface ElectronicItemModel {
    electronicItemID?: number;
    electronicItemName: string;
    price: number;
    qoh: number;
    electronicItemImageUrl?: string;
    electronicItemImage?: string;

    //FK: Fields
    brandResponseDto?: BrandModel;
    categoryResponseDto?: CategoryModel;
}