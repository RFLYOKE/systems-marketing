import ProgrammerPage from "@/components/programmer";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Manajemen Programmer" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <ProgrammerPage />
        </div>
      </div>
    </div>
  );
}
