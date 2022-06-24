import { ProductModel } from "../models/product.model";

export interface ProductServiceInterface {
    addProduct(url:string,activityIds:string[],price:string):Promise<ProductModel>
}