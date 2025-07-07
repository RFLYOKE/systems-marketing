import { SiteHeader } from "@/components/site-header";
// import { DataTable } from "@/components/data-table";
import { SummaryCards } from "@/components/summary-cards";
// import raw from "@/json/applications.json";
// import { ChartAreaDashboard } from "@/components/chart/chart-area-dashboard";

// type RawApp = {
//   id: string;
//   customerName: string;
//   productType: string;
//   amount: number;
//   date: string;
//   status: string;
//   sales: string;
//   coordinator: string;
// };

// type TableRow = {
//   header: string;
//   id: number;
//   status: string;
//   target: string;
//   type: string;
//   limit: string;
//   reviewer: string;
// };

// const tableData: TableRow[] = (raw as RawApp[]).map((app, idx) => ({
//   header: `${app.customerName} (${app.productType})`,
//   id: idx + 1,
//   status: app.status,
//   target: app.date,
//   type: app.productType,
//   limit: new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//   }).format(app.amount),
//   reviewer: app.coordinator,
// }));

export default function Page() {
  return (
    <>
      <SiteHeader title="Dashboard Admin" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <SummaryCards />
            </div>
            {/* <div className="px-4 lg:px-6">
              <ChartAreaDashboard />
            </div> */}
            {/* <div className="px-4 lg:px-6">
              <DataTable data={tableData} />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
