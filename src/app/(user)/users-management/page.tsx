import CreateUser from "@/components/create-user";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Manajemen User" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <CreateUser />
        </div>
      </div>
    </>
  );
}
