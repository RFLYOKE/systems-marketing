'use client';
import TransactionProductPage from "@/components/marketing-management/transaction-product";
import { SiteHeader } from "@/components/site-header";


export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Data Marketing" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <TransactionProductPage/>
        </div>
      </div>
    </div>
  );
}
