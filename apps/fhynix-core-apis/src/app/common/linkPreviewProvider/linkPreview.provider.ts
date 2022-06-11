import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import {environment} from '../../../environments/environment';
import axios from 'axios';
import { LinkPreviewProviderInterface } from './linkPreview-provider.interface';
import { ThirdPartyAPIError } from '../errors/custom-errors/third-party.error';
import { ApiErrorCode } from 'apps/shared/payloads/error-codes';
import { ArticleModel } from '../models/article.model';

@injectable()
export class LinkPreviewProvider implements LinkPreviewProviderInterface {
    private linkPreviewUrl = `http://api.linkpreview.net/?key=${environment.linkPreviewApiKey}`;

    async getPreview(url: string) {

        const fetchUrl = `${this.linkPreviewUrl}&q=${url}`;
        let articleData;
        try {
            const response = await axios.get(fetchUrl);
            articleData = response.data;
        } catch (error) {
            throw new ThirdPartyAPIError(ApiErrorCode.E0003);
        }

        const article:ArticleModel = {
            title:articleData.title,
            url:articleData.url,
            imageUrl:articleData.image,
            description:articleData.description
        }

        return article;
    }
    
}