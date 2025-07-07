import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LendingProduct } from "@/types/sales-manage";

interface Props {
  form: Partial<LendingProduct>;
  setForm: (form: Partial<LendingProduct>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  editingId: number | null;
}

export default function LendingProductForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  editingId,
}: Props) {
  function formatRibuan(value?: string | number): string {
    if (!value) return "";
    const number =
      typeof value === "number"
        ? value
        : parseInt(value.replace(/\D/g, "") || "0");
    return number.toLocaleString("id-ID");
  }

  function parseRibuanToNumber(value: string): number {
    return parseInt(value.replace(/\D/g, "") || "0");
  }  
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit" : "Tambah"} Produk Pinjaman
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1">
          <label>Nama Produk</label>
          <Input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <label>Deskripsi</label>
          <Input
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <label>Jumlah Pinjaman Minimum</label>
          <Input
            type="text"
            inputMode="numeric"
            value={formatRibuan(form.loan_amount_min)}
            onChange={(e) =>
              setForm({
                ...form,
                loan_amount_min: parseRibuanToNumber(e.target.value),
              })
            }
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <label>Jumlah Pinjaman Maksimum</label>
          <Input
            type="text"
            inputMode="numeric"
            value={formatRibuan(form.loan_amount_max)}
            onChange={(e) =>
              setForm({
                ...form,
                loan_amount_max: parseRibuanToNumber(e.target.value),
              })
            }
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <label>Suku Bunga (%)</label>
          <Input
            type="number"
            value={form.interest_rate || ""}
            onChange={(e) =>
              setForm({ ...form, interest_rate: Number(e.target.value) })
            }
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <label>Ketentuan Pembayaran</label>
          <Input
            value={form.repayment_terms || ""}
            onChange={(e) =>
              setForm({ ...form, repayment_terms: e.target.value })
            }
          />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <label>Kriteria Kelayakan</label>
          <Input
            value={form.eligibility_criteria || ""}
            onChange={(e) =>
              setForm({ ...form, eligibility_criteria: e.target.value })
            }
          />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <label>Status</label>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={form.status ? "0" : "1"}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value === "1" })
            }
          >
            <option value="1">Aktif</option>
            <option value="0">Tidak Aktif</option>
          </select>
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
