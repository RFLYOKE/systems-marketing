export interface ServiceTransaction {
  id: number;
  marketing_id: number;
  category: string;
  title: string;
  description: string;
  nominal: number;
  fee_marketing: number;
  dibayar: number;
  sisa: number;
  status: boolean;
  transaction_date: string;
  deadline_date: string;
  created_at: string;
  updated_at: string;
  marketing_name: string;
}