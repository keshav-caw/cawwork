import { VendorModel } from "../models/vendor.model";
import { PaginationModel } from "../models/pagination.model";


export interface VendorRepositoryInterface {
    getVendorsAssociatedToActivityId(activityId:string,latitude:number,longitude:number,details:PaginationModel): Promise<VendorModel[]>
}
