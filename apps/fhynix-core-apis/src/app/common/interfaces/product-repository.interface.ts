import { PaginationModel } from "../models/pagination.model";
import { ProductModel } from "../models/product.model";

export interface ProductRepositoryInterface{
    addProduct(product:ProductModel):Promise<ProductModel>
    getProductsAssociatedToActivityId(activityId:string,details:PaginationModel): Promise<ProductModel[]>
}