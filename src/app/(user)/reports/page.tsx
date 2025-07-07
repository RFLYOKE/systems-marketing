import RouteOptimizationSection from "@/components/configuration-systems/RouteOptimizationSection";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Optimation Rute" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <RouteOptimizationSection/>
        </div>
      </div>
    </>
  );
}
