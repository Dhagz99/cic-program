import { ImportBatchItem } from "../cic/batch.types";

export interface InitializeParams {
    branchId?: string;
    isAdmin?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  };



export interface InitializePaginationResponse {
    success: boolean;
    data: ImportBatchItem[];
    pagination: {
        page: number;
  
        limit: number;
  
        total: number;
  
        totalPages: number;
     };
}