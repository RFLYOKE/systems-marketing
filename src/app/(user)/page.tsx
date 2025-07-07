// import { ChartAreaInteractive } from "@/components/chart/chart-area-interactive";
// import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";
// import data from "@/json/data.json";

export default function Page() {
  return (
    <>
      <SiteHeader title="Shortcut"></SiteHeader>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
          </div>
        </div>
      </div>
    </>
  );
}
