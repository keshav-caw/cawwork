import { ArticleResponsePayload } from "./article-response.payload";
import { ProductResponsePayload } from "./product-response.payload";
import { RestaurantResponsePayload } from "./restaurant-response.payload";
import {VendorResponsePayload} from "./vendor-response.payload";
import {MovieResponsePayload} from "./movie-response.payload";

import { ResponsePayloadBase } from "./base-response.payload";

export class SuggestionResponsePayload extends ResponsePayloadBase {
    articles:ArticleResponsePayload[]
    products:ProductResponsePayload[]
    vendors:VendorResponsePayload[]
    restaurants:RestaurantResponsePayload[]
    movies:MovieResponsePayload[]
    constructor(articles,products,vendors,restaurants,movies){
        super()
        this.articles = articles;
        this.products = products;
        this.vendors = vendors;
        this.restaurants = restaurants;
        this.movies = movies;
    }
}
  