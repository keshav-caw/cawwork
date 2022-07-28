import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { ArticleRepositoryInterface } from '../../common/interfaces/article-repository.interface'
import { SuggestionServiceInterface } from '../../common/interfaces/suggestion-service.interface'
import { SuggestionController } from './controllers/suggestion.controller'
import { SuggestionTypes } from './suggestion.types'
import { SuggestionService } from './services/suggestion.service'
import { ArticleRepository } from './repositories/article.repository'
import { ProductRepositoryInterface } from '../../common/interfaces/product-repository.interface'
import { ProductRepository } from './repositories/product.repository'
import { VendorRepositoryInterface } from '../../common/interfaces/vendor-repository.interface'
import { VendorRepository } from './repositories/vendor.repository'
import { RestaurantRepositoryInterface } from '../../common/interfaces/restaurant-repository.interface'
import { RestaurantRepository } from './repositories/restaurant.repository'
import { MovieRepositoryInterface } from '../../common/interfaces/movie-repository.interface'
import { MovieRepository } from './repositories/movie.repository'
import { ArticleServiceInterface } from '../../common/interfaces/article-service.interface'
import { ArticleService } from './services/articles.service'
import { ProductServiceInterface } from '../../common/interfaces/product-service.interface'
import { ProductService } from './services/product.service'
import { ArticleController } from './controllers/article.controller'
import { ProductController } from './controllers/product.controller'
import { SuggestionPayloadGenerator } from './controllers/suggestionPayloadGenerator'

@injectable()
export default class SuggestionBootstrapper {
  public static initialize() {
      CommonContainer.bind<ArticleRepositoryInterface>('ArticleRepository').to(ArticleRepository)
      CommonContainer.bind<ProductRepositoryInterface>('ProductRepository').to(ProductRepository)
      CommonContainer.bind<VendorRepositoryInterface>('VendorRepository').to(VendorRepository)
      CommonContainer.bind<RestaurantRepositoryInterface>('RestaurantRepository').to(RestaurantRepository)
      CommonContainer.bind<MovieRepositoryInterface>('MovieRepository').to(MovieRepository)

      CommonContainer.bind<ArticleServiceInterface>(SuggestionTypes.articles).to(ArticleService)
      CommonContainer.bind<ProductServiceInterface>(SuggestionTypes.product).to(ProductService)
      CommonContainer.bind<SuggestionServiceInterface>(SuggestionTypes.suggestions).to(SuggestionService)

      CommonContainer.bind<ArticleController>('ArticleController').to(ArticleController)
      CommonContainer.bind<ProductController>('ProductController').to(ProductController)
      CommonContainer.bind<SuggestionController>('SuggestionController').to(SuggestionController)
      CommonContainer.bind<SuggestionPayloadGenerator>('SuggestionPayloadGenerator').to(SuggestionPayloadGenerator)
  }
}
