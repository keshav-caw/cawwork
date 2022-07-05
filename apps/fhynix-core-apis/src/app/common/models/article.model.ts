export class ArticleModel {
    id?: string
    title: string
    imageUrl: string
    url: string
    activityIds?:string[]
    description?:String
    createdAtUtc?:Date
    createdBy?: String
    updatedAtUtc?: Date
    updatedBy?: String
    isDeleted?: Boolean
}