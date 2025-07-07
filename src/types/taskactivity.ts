export interface TaskSchedule {
  id: number;
  assignment_id: number;
  scheduled_at: string; // format: "YYYY-MM-DD HH:mm"
  customer_id: number;
  customer_first_name: string;
  customer_last_name: string;
  coordinator_id: number;
  coordinator_name: string;
  coordinator_email: string;
  sales_id: number;
  sales_name: string;
  sales_email: string;
  status: number;
}
