export interface FundingProduct {
  id: number;
  name: string;
  description: string;
  minimum_amount: number;
  maximum_amount: number;
  interest_rate: number;
  eligibility_criteria: string;
  status: boolean;
}  

export interface LendingProduct {
  id: number; 
  name: string;
  description: string;
  loan_amount_min: number;
  loan_amount_max: number;
  interest_rate: number;
  repayment_terms: string;
  eligibility_criteria: string;
  status: boolean;
}


export interface FundingApplication {
  id: number;
  customerName: string;
  product: string;
  amount: number;
  date: string;
  status: "Tertunda" | "Disetujui" | "Ditolak";
  sales: string;
  coordinator: string;
  approvalDate?: string;
  disbursementDate?: string;
}

export type LendingApplicationStatus = "Tertunda" | "Disetujui" | "Ditolak";

export interface LendingApplication {
  id: number;
  customerName: string;
  product: string;
  amount: number;
  date: string;
  status: LendingApplicationStatus;
  sales: string;
  coordinator: string;
}