export interface DashboardResponse {
    success: boolean;
    data: {
        totalBorrowers: number;
        totalActiveLoans: number;
        totalLoanAmount: number;
        totalExports: number;
        activeLoanGrowth: number;
        borrowerGrowth: number;
        loanAmountGrowth: number;
        monthlyLoanTrends:{
            amount: number;
            borrowers: number;
            loans: number;
            month: string;
        }[];
        branches:{
            branchId: string;
            branchCode: string;
            branchName: string;
            totalBorrowers: number;
            totalActiveLoans: number;
            totalLoanAmount: number;
        },
        recentCicExports: {
            id: string;
            branchName: string;
            importBatchId: string;
            reportingPeriod: string;
            status: string;
            totalRecords: number;
            createdAt: string;
        }[];

    }
}