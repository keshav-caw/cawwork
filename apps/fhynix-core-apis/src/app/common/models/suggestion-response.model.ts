import { ArticleModel } from "./article.model";
import { MovieModel } from "./movie.model";
import { ProductModel } from "./product.model";
import { RestaurantModel } from "./restaurant.model";
import { VendorModel } from "./vendor.model";

export class SuggestionResponseModel{
    articles:ArticleModel[]
    products:ProductModel[]
    vendors:VendorModel[]
    restaurants:RestaurantModel[]
    movies:MovieModel[]
}