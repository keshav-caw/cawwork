import { ProductModel } from "../models/product.model";

export interface ProductServiceInterface {
    addProduct(url:string,price:string,activityIds:string[]):Promise<ProductModel>
}