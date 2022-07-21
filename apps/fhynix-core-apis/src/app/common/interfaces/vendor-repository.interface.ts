import { VendorModel } from "../models/activity.model";
import { PaginationModel } from "../models/pagination.model";


export interface VendorRepositoryInterface {
  getVendors(details:PaginationModel): Promise<VendorModel[]>
}
