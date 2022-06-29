import { ProductModel } from "../models/product.model";

export interface ProductRepositoryInterface{
    addProduct(product:ProductModel):Promise<ProductModel>
}