export class ArticleModel {
    id: string
    title: string
    imageUrl: string
    url: string
    createdAtUtc?:Date
    createdBy?: String
    updatedAtUtc?: Date
    updatedBy?: String
    isDeleted?: Boolean
}