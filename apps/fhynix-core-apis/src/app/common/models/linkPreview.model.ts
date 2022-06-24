export class LinkPreviewModel {
    id?: string
    title: string
    imageUrl: string
    url: string
    price?: string
    activityIds?:string[]
    description?:String
    createdAtUtc?:Date
    createdBy?: String
    updatedAtUtc?: Date
    updatedBy?: String
    isDeleted?: Boolean
}