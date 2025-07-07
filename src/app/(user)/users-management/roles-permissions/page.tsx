import RolePage from "@/components/roles";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Roles & Permissions" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <RolePage/>
        </div>
      </div>
    </>
  );
}
