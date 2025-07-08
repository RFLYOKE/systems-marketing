'use client';
import TransactionServicePage from "@/components/marketing-management/transaction-jasa";
import { SiteHeader } from "@/components/site-header";


export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Data Marketing" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <TransactionServicePage/>
        </div>
      </div>
    </div>
  );
}
