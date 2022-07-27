export class RestaurantModel {
    id:string
    name:string
    address: string 
    phoneNumbers:string[] 
    activityIds?:string[]
    imageUrl: string
    latitude:number
    longitude:number
    distance?:number
}