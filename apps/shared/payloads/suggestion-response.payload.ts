import { ResponsePayloadBase } from "./base-response.payload";
import { ArticleModel } from '../../fhynix-core-apis/src/app/common/models/article.model'
import { RestaurantModel,MovieModel,VendorModel } from '../../fhynix-core-apis/src/app/common/models/activity-model'
import { ProductModel } from '../../fhynix-core-apis/src/app/common/models/product.model'

export class SuggestionResponsePayload extends ResponsePayloadBase {
    articles:ArticleModel[]
    products:ProductModel[]
    vendors:VendorModel[]
    restaurants:RestaurantModel[]
    movies:MovieModel[]
    constructor(articles,products,vendors,restaurants,movies){
        super()
        this.articles = articles;
        this.products = products;
        this.vendors = vendors;
        this.restaurants = restaurants;
        this.movies = movies;
    }
}
  