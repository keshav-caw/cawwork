export class ProductModel {
    id?: string
    title: string
    imageUrl: string
    url: string
    price?: string
    activityIds?:string[]
    description?:string
    createdAtUtc?:Date
    createdBy?: string
    updatedAtUtc?: Date
    updatedBy?: string
    isDeleted?: boolean
}