import { PaginationModel } from "../models/pagination.model";
import { ProductModel } from "../models/product.model";

export interface ProductRepositoryInterface{
    addProduct(product:ProductModel):Promise<ProductModel>
    getProductsAssociatedToActivityId(details:PaginationModel,activityId:string): Promise<ProductModel[]>
}