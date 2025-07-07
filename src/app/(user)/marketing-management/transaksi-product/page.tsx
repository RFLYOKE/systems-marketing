'use client';
import FundingApplicationPage from "@/components/management-sales/applications/funding-app";
import { SiteHeader } from "@/components/site-header";


export default function Page() {
  return (
    <>
      <SiteHeader title="Data Marketing" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <FundingApplicationPage />
        </div>
      </div>
    </>
  );
}
