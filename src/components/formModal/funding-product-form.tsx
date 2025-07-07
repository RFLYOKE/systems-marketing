"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FundingProduct } from "@/types/sales-manage";

interface FundingProductFormProps {
  form: Partial<FundingProduct>;
  setForm: (form: Partial<FundingProduct>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function FundingProductForm({
  form,
  setForm,
  onCancel,
  onSubmit,
}: FundingProductFormProps) {
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
        <h2 className="text-lg font-semibold">Tambah Produk Pendanaan</h2>
        <Button variant="ghost" onClick={onCancel} aria-label="Tutup">
          ✕
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1">
          <Label>Nama Produk</Label>
          <Input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Deskripsi</Label>
          <Input
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Jumlah Minimum</Label>
          <Input
            type="text"
            inputMode="numeric"
            value={formatRibuan(form.minimum_amount)}
            onChange={(e) =>
              setForm({
                ...form,
                minimum_amount: parseRibuanToNumber(e.target.value),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Jumlah Maksimum</Label>
          <Input
            type="text"
            inputMode="numeric"
            value={formatRibuan(form.maximum_amount)}
            onChange={(e) =>
              setForm({
                ...form,
                maximum_amount: parseRibuanToNumber(e.target.value),
              })
            }
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Suku Bunga (%)</Label>
          <Input
            type="number"
            value={form.interest_rate ?? ""}
            onChange={(e) =>
              setForm({ ...form, interest_rate: +e.target.value })
            }
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Kriteria Kelayakan</Label>
          <Input
            value={form.eligibility_criteria || ""}
            onChange={(e) =>
              setForm({ ...form, eligibility_criteria: e.target.value })
            }
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Status</Label>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={form.status ? "false" : "true"}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value === "true" })
            }
          >
            <option value="true">Aktif</option>
            <option value="false">Tidak Aktif</option>
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
