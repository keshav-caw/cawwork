export class ArticleModel {
    id?: string
    title: string
    imageUrl: string
    url: string
    activityIds?:string[]
    description?:string
    createdAtUtc?:Date
    createdBy?: string
    updatedAtUtc?: Date
    updatedBy?: string
    isDeleted?: boolean
}