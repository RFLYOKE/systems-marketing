import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface FundingApplication {
  id: number;
  customerName: string;
  product: string;
  amount: number;
  date: string;
  status: "Tertunda" | "Disetujui" | "Ditolak";
  sales: string;
  coordinator: string;
  approvalDate?: string;
  disbursementDate?: string;
}

interface Props {
  form: Partial<FundingApplication>;
  setForm: (form: Partial<FundingApplication>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  editingId: number | null;
}

export default function FundingApplicationForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  editingId,
}: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit" : "Tambah"} Aplikasi Pendanaan
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1">
          <label>Nama Pelanggan</label>
          <Input
            value={form.customerName || ""}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label>Produk</label>
          <Input
            value={form.product || ""}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label>Jumlah</label>
          <Input
            type="number"
            value={form.amount || ""}
            onChange={(e) =>
              setForm({ ...form, amount: Number(e.target.value) })
            }
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label>Sales</label>
          <Input
            value={form.sales || ""}
            onChange={(e) => setForm({ ...form, sales: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label>Koordinator</label>
          <Input
            value={form.coordinator || ""}
            onChange={(e) => setForm({ ...form, coordinator: e.target.value })}
          />
        </div>
      </div>
      <div className="pt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={onSubmit}>Simpan</Button>
      </div>
    </div>
  );
}
