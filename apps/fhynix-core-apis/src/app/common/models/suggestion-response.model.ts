import { MovieModel, RestaurantModel, VendorModel } from "./activity.model";
import { ArticleModel } from "./article.model";
import { ProductModel } from "./product.model";

export class SuggestionResponseModel{
    articles:ArticleModel[]
    products:ProductModel[]
    vendors:VendorModel[]
    restaurants:RestaurantModel[]
    movies:MovieModel[]
}