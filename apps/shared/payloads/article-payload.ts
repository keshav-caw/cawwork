export class ArticlePayload {
    title: string
    imageUrl:string
    url:string
    constructor(title,imageUrl,url){
        this.title = title;
        this.imageUrl = imageUrl;
        this.url = url;
    }    
}
  