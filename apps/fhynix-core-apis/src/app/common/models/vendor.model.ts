export class VendorModel {
    id:string
    name:string
    address?: string 
    phoneNumbers:string[] 
    activityIds:string[]
    distance?:number
    latitude:number
    longitude: number
  }