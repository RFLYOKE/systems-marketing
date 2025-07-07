import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  LendingApplication,
  LendingApplicationStatus,
} from "@/types/sales-manage";

interface Props {
  form: Partial<LendingApplication>;
  setForm: (form: Partial<LendingApplication>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  editingId: number | null;
}

export default function LendingApplicationForm({
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
          {editingId ? "Edit" : "Tambah"} Aplikasi Pinjaman
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
              setForm({ ...form, amount: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label>Tanggal Aplikasi</label>
          <Input
            type="date"
            value={form.date || ""}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label>Status</label>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={form.status || "Tertunda"}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as LendingApplicationStatus,
              })
            }
          >
            <option value="Tertunda">Tertunda</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Ditolak">Ditolak</option>
          </select>
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
