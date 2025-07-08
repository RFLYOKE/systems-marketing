'use client';
import DataMarketingPage from "@/components/marketing-management/transaction-jasa";
import { SiteHeader } from "@/components/site-header";


export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Manajemen Marketing" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <DataMarketingPage />
        </div>
      </div>
    </div>
  );
}
