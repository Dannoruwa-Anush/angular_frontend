
import { CategoryModel } from "./categoryModel";
import { BrandReadModel } from "./read_models/brand_read_Model";

export interface ElectronicItemModel {
    electronicItemID?: number;
    electronicItemName: string;
    price: number;
    qoh: number;
    electronicItemImageUrl?: string;
    electronicItemImage?: string;

    //FK: Fields
    brandResponseDto?: BrandReadModel;
    categoryResponseDto?: CategoryModel;
}