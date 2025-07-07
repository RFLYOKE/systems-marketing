'use client';
import FundingProductPage from "@/components/management-sales/product/funding-product";
import { SiteHeader } from "@/components/site-header";


export default function Page() {
  return (
    <>
      <SiteHeader title="Transaksi Product" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <FundingProductPage />
        </div>
      </div>
    </>
  );
}
