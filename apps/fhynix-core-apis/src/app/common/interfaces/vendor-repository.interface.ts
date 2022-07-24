import { VendorModel } from "../models/vendor.model";
import { PaginationModel } from "../models/pagination.model";


export interface VendorRepositoryInterface {
    getVendorsAssociatedToActivityId(details:PaginationModel,activityId:string): Promise<VendorModel[]>
}
