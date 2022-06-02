import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import {environment} from '../../../environments/environment';
import axios from 'axios';
import { LinkPreviewProviderInterface } from './linkPreview-provider.interface';
import { DataStore } from '../data/datastore';
import { CommonContainer } from '../container';
import { RequestContext } from '../jwtservice/requests-context.service';
import { CommonTypes } from '../common.types';
import UnauthorizedError from '../errors/custom-errors/unauthorized.error';

@injectable()
export class LinkPreviewProvider implements LinkPreviewProviderInterface {
    private linkPreviewUrl = `http://api.linkpreview.net/?key=${environment.linkPreviewApiKey}`;
    protected client;
    private readonly requestContext = CommonContainer.get<RequestContext>(CommonTypes.requestContext);

    constructor(@inject('DataStore') protected store: DataStore,) {
        this.client = this.store.getClient()
    }

    async addArticle(url: string) {

        const userId = this.requestContext.getUserId();
        
        const users = await this.client.users?.findMany({
            select: {
              isAdmin:true
            },
            where: {
              id:userId
            },
        })
        

        if(!users[0].isAdmin){
            throw new UnauthorizedError();
        }

        const fetchUrl = `${this.linkPreviewUrl}&q=${url}`;
        let articleData;
        try {
            const response = await axios.get(fetchUrl);
            articleData = response.data;
        } catch (error) {
            articleData = error.response.data
        }

        if(!articleData.title || !articleData.url || !articleData.image || !articleData.description){
            throw new Error("Extraction of data failed")
        }

        const newArticle = {
            title:articleData.title,
            url:articleData.url,
            imageUrl:articleData.image,
            description:articleData.description
        }

        await this.client.articles?.create({
            data: newArticle,
        })

        return articleData;
    }
    
}