import { BrandReadModel } from "../read_models/brand_read_Model";
import { CategoryReadModel } from "../read_models/category_read_Model";

export interface ElectronicItemCreateUpdateModel {
    electronicItemName: string;
    price: number;
    qoh: number;
    electronicItemImage?: string;

    //FK: Fields
    brandResponseDto?: BrandReadModel;
    categoryResponseDto?: CategoryReadModel;
}