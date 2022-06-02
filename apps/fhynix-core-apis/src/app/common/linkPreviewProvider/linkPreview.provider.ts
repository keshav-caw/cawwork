import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import {environment} from '../../../environments/environment';
import axios from 'axios';
import { LinkPreviewProviderInterface } from './linkPreview-provider.interface';
import { DataStore } from '../data/datastore';
import { ArticleRepository } from '../../components/articles/article.repository';
import { UserRepository } from '../../components/users/user.repository';

@injectable()
export class LinkPreviewProvider implements LinkPreviewProviderInterface {
    private linkPreviewUrl = `http://api.linkpreview.net/?key=${environment.linkPreviewApiKey}`;
    
    constructor(
        @inject('DataStore') protected store: DataStore,
        @inject('ArticleRepository') private articleRepository: ArticleRepository,
        @inject('UserRepository') private userRepository: UserRepository,
    ) {}

    async getPreview(url: string) {
        await this.userRepository.rejectIfNotAdmin();
        
        const fetchUrl = `${this.linkPreviewUrl}&q=${url}`;
        let articleData;
        try {
            const response = await axios.get(fetchUrl);
            articleData = response.data;
        } catch (error) {
            articleData = error.response.data
        }

        await this.articleRepository.addArticle(articleData);
        return articleData;
    }
    
}