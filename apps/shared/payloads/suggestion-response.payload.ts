import { ResponsePayloadBase } from "./base-response.payload";
import { PaginatedResponsePayload } from "./api-paginated-response.payload";
import { ArticleModel } from "apps/fhynix-core-apis/src/app/common/models/article.model";
import { ProductModel } from "apps/fhynix-core-apis/src/app/common/models/product.model";
import { VendorModel,RestaurantModel,MovieModel } from "apps/fhynix-core-apis/src/app/common/models/activity.model";

export class SuggestionResponsePayload extends ResponsePayloadBase {
    articles:PaginatedResponsePayload<ArticleModel>
    products:PaginatedResponsePayload<ProductModel>
    vendors:PaginatedResponsePayload<VendorModel>
    restaurants:PaginatedResponsePayload<RestaurantModel>
    movies:PaginatedResponsePayload<MovieModel>
    constructor(articles,products,vendors,restaurants,movies){
        super()
        this.articles = articles;
        this.products = products;
        this.vendors = vendors;
        this.restaurants = restaurants;
        this.movies = movies;
    }
}
  