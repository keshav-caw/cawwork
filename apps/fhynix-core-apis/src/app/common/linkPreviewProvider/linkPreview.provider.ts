import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import {environment} from '../../../environments/environment';
import axios from 'axios';
import { LinkPreviewProviderInterface } from './linkPreview-provider.interface';
import { ThirdPartyAPIError } from '../errors/custom-errors/third-party.error';
import { ApiErrorCode } from 'apps/shared/payloads/error-codes';
import { LinkPreviewModel } from '../models/linkPreview.model';

@injectable()
export class LinkPreviewProvider implements LinkPreviewProviderInterface {
    private linkPreviewUrl = `http://api.linkpreview.net/?key=${environment.linkPreviewApiKey}`;

    async getPreview(url: string) {

        const fetchUrl = `${this.linkPreviewUrl}&q=${url}`;
        let responseData;
        try {
            const response = await axios.get(fetchUrl);
            responseData = response.data;
        } catch (error) {
            throw new ThirdPartyAPIError(ApiErrorCode.E0003);
        }

        const response:LinkPreviewModel = {
            title:responseData.title,
            url:responseData.url,
            imageUrl:responseData.image,
            description:responseData.description
        }

        return response;
    }
    
}