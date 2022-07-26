import { ArticleResponsePayload } from 'apps/shared/payloads/article-response.payload';
import { MovieResponsePayload } from 'apps/shared/payloads/movie-response.payload';
import { ProductResponsePayload } from 'apps/shared/payloads/product-response.payload';
import { RestaurantResponsePayload } from 'apps/shared/payloads/restaurant-response.payload';
import { SuggestionResponsePayload } from 'apps/shared/payloads/suggestion-response.payload';
import { VendorResponsePayload } from 'apps/shared/payloads/vendor-response.payload';
import { injectable } from 'inversify'
import 'reflect-metadata'
import { ModelPayloadHelperInterface } from '../../common/interfaces/model-payload-helper.interface';
import { SuggestionResponseModel } from '../../common/models/suggestion-response.model';

@injectable()
export class ModelPayloadHelper implements ModelPayloadHelperInterface {
    suggestionResponsePayloadFromModel(response:SuggestionResponseModel){
        const articlePayloads:ArticleResponsePayload[] = [];
        for(const article of response.articles){
            const articlePayload = new ArticleResponsePayload(article.id,article.title,article.imageUrl,article.url,article.description,article.activityIds);
            articlePayloads.push(articlePayload);
        }

        const productPayloads:ProductResponsePayload[] = [];
        for(const product of response.products){
            const productPayload = new ProductResponsePayload(product.id,product.title,product.imageUrl,product.url,product.price,product.description,product.activityIds);
            productPayloads.push(productPayload);
        }

        const vendorPayloads:VendorResponsePayload[] = [];
        for(const vendor of response.vendors){
            const vendorPayload = new VendorResponsePayload(vendor.id,vendor.name,vendor.phoneNumbers,vendor.activityIds,vendor.address);
            vendorPayloads.push(vendorPayload);
        }

        const restaurantPayloads:RestaurantResponsePayload[] = [];
        for(const restaurant of response.restaurants){
            const restaurantPayload = new RestaurantResponsePayload(restaurant.id,restaurant.name,restaurant.address,restaurant.phoneNumbers,restaurant.imageUrl,restaurant.activityIds);
            restaurantPayloads.push(restaurantPayload);
        }

        const moviePayloads:MovieResponsePayload[] = [];
        for(const movie of response.movies){
            const moviePayload = new MovieResponsePayload(movie.id,movie.title,movie.activityIds,movie.imageUrl,movie.description,movie.language,movie.runningTime);
            moviePayloads.push(moviePayload);
        }

        const responsePayload = new SuggestionResponsePayload(articlePayloads,productPayloads,vendorPayloads,restaurantPayloads,moviePayloads);

        return responsePayload;
    }
}
