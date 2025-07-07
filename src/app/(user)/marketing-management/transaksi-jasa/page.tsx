'use client';
import LendingProductPage from "@/components/management-sales/product/lending-product";
import { SiteHeader } from "@/components/site-header";


export default function Page() {
  return (
    <>
      <SiteHeader title="Transaksi Jasa" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <LendingProductPage />
        </div>
      </div>
    </>
  );
}
