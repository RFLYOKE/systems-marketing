export interface CostParameter {
  id: string;
  productName: string;
  costType: "Tetap" | "Persentase";
  costValue: string;
  startDate: string;
  endDate: string;
}
