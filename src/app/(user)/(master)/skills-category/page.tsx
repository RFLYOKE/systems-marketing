import SkillsCategoryPage from "@/components/skills-category";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader title="Skills Category" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <SkillsCategoryPage />
        </div>
      </div>
    </>
  );
}
