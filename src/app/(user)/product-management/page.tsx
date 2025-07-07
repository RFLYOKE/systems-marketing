import ProductPage from "@/components/product-it-file/product-page";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <div className="w-full max-w-6xl">
      <SiteHeader title="Manajemen Product IT" />
      <div className="flex flex-1 flex-col">
        <div className="w-full">
            <ProductPage/>
        </div>
      </div>
    </div>
  );
}
