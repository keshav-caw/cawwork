import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import {environment} from '../../../environments/environment';
import axios from 'axios';
import { LinkPreviewProviderInterface } from './linkPreview-provider.interface';
import { DataStore } from '../data/datastore';
import { ArticleRepository } from '../../components/articles/article.repository';
import { UserRepository } from '../../components/users/user.repository';
import { ThirdPartyAPIError } from '../errors/custom-errors/third-party.error';
import { ApiErrorCode } from 'apps/shared/payloads/error-codes';

@injectable()
export class LinkPreviewProvider implements LinkPreviewProviderInterface {
    private linkPreviewUrl = `http://api.linkpreview.net/?key=${environment.linkPreviewApiKey}`;
    
    constructor(
        @inject('DataStore') protected store: DataStore
    ) {}

    async getPreview(url: string) {

        const fetchUrl = `${this.linkPreviewUrl}&q=${url}`;
        let articleData;
        try {
            const response = await axios.get(fetchUrl);
            articleData = response.data;
        } catch (error) {
            throw new ThirdPartyAPIError(ApiErrorCode.E0015);
        }

        return articleData;
    }
    
}