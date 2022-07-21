import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { ArticleRepositoryInterface } from '../../common/interfaces/article-repository.interface'
import { SuggestionServiceInterface } from '../../common/interfaces/suggestion-service.interface'
import { SuggestionController } from './suggestion.controller'
import { SuggestionTypes } from './suggestion.types'
import { SuggestionService } from './suggestion.service'
import { ArticleRepository } from './article.repository'
import { ProductRepositoryInterface } from '../../common/interfaces/product-repository.interface'
import { ProductRepository } from './product.repository'
import { VendorRepositoryInterface } from '../../common/interfaces/vendor-repository.interface'
import { VendorRepository } from './vendor.repository'
import { RestaurantRepositoryInterface } from '../../common/interfaces/restaurant-repository.interface'
import { RestaurantRepository } from './restaurant.repository'
import { MovieRepositoryInterface } from '../../common/interfaces/movie-repository.interface'
import { MovieRepository } from './movie.repository'

@injectable()
export default class SuggestionBootstrapper {
  public static initialize() {
      CommonContainer.bind<ArticleRepositoryInterface>('ArticleRepository').to(ArticleRepository)
      CommonContainer.bind<ProductRepositoryInterface>('ProductRepository').to(ProductRepository)
      CommonContainer.bind<VendorRepositoryInterface>('VendorRepository').to(VendorRepository)
      CommonContainer.bind<RestaurantRepositoryInterface>('RestaurantRepository').to(RestaurantRepository)
      CommonContainer.bind<MovieRepositoryInterface>('MovieRepository').to(MovieRepository)

      CommonContainer.bind<SuggestionServiceInterface>(SuggestionTypes.suggestions).to(SuggestionService)
      CommonContainer.bind<SuggestionController>('SuggestionController').to(SuggestionController)
  }
}
