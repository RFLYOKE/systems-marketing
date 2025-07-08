"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { useGetMarketingsQuery } from "@/services/marketing.service";
import { ServiceTransaction } from "@/types/jasa-transaction";

interface Props {
  form: Partial<ServiceTransaction>;
  setForm: (form: Partial<ServiceTransaction>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  editingId: number | null;
}

export interface Marketing {
  id: number;
  name: string;
  email?: string;
}

export default function ServiceTransactionForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  editingId,
}: Props) {
  const { data: marketingRes, isLoading: isLoadingMarketing } =
    useGetMarketingsQuery({
      page: 1,
      paginate: 100,
      search: "",
    });

  const formatRupiah = (value: string | number) => {
    const number =
      typeof value === "number" ? value : parseInt(value.replace(/\D/g, ""));
    if (isNaN(number)) return "";
    return number.toLocaleString("id-ID");
  };

  const parseRupiahToNumber = (value: string) => {
    return parseInt(value.replace(/\D/g, "")) || 0;
  };

  const marketings = marketingRes?.data ?? [];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit" : "Tambah"} Transaksi Jasa
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Marketing Select */}
        <div className="flex flex-col gap-y-1">
          <label>Marketing</label>
          <Combobox<Marketing>
            value={form.marketing_id ?? null}
            onChange={(val) => setForm({ ...form, marketing_id: val })}
            data={marketings}
            isLoading={isLoadingMarketing}
            getOptionLabel={(item) => item.name}
          />
        </div>

        {/* Kategori Jasa */}
        <div className="flex flex-col gap-y-1">
          <label>Kategori Jasa</label>
          <Input
            value={form.category ?? ""}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>

        {/* Judul Jasa */}
        <div className="flex flex-col gap-y-1 sm:col-span-2">
          <label>Judul</label>
          <Input
            value={form.title ?? ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-y-1 sm:col-span-2">
          <label>Deskripsi</label>
          <textarea
            rows={4}
            className="border rounded px-3 py-2 bg-white dark:bg-zinc-800"
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Nominal */}
        <div className="flex flex-col gap-y-1">
          <label>Nominal</label>
          <Input
            type="text"
            value={formatRupiah(form.nominal ?? "")}
            onChange={(e) => {
              const raw = parseRupiahToNumber(e.target.value);
              setForm({ ...form, nominal: raw });
            }}
          />
        </div>

        {/* Fee Marketing */}
        <div className="flex flex-col gap-y-1">
          <label>Fee Marketing</label>
          <Input
            type="text"
            value={formatRupiah(form.fee_marketing ?? "")}
            onChange={(e) => {
              const raw = parseRupiahToNumber(e.target.value);
              setForm({ ...form, fee_marketing: raw });
            }}
          />
        </div>

        {/* Dibayar */}
        <div className="flex flex-col gap-y-1">
          <label>Dibayar</label>
          <Input
            type="text"
            value={formatRupiah(form.dibayar ?? "")}
            onChange={(e) => {
              const raw = parseRupiahToNumber(e.target.value);
              setForm({ ...form, dibayar: raw });
            }}
          />
        </div>

        {/* Sisa */}
        <div className="flex flex-col gap-y-1">
          <label>Sisa</label>
          <Input
            type="text"
            value={formatRupiah(form.sisa ?? "")}
            onChange={(e) => {
              const raw = parseRupiahToNumber(e.target.value);
              setForm({ ...form, sisa: raw });
            }}
          />
        </div>

        {/* Tanggal Transaksi */}
        <div className="flex flex-col gap-y-1">
          <label>Tanggal Transaksi</label>
          <Input
            type="date"
            value={form.transaction_date?.slice(0, 10) ?? ""}
            onChange={(e) =>
              setForm({ ...form, transaction_date: e.target.value })
            }
          />
        </div>

        {/* Deadline */}
        <div className="flex flex-col gap-y-1">
          <label>Deadline</label>
          <Input
            type="date"
            value={form.deadline_date?.slice(0, 10) ?? ""}
            onChange={(e) =>
              setForm({ ...form, deadline_date: e.target.value })
            }
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-y-1 col-span-2">
          <label>Status</label>
          <select
            className="border rounded px-3 py-2 bg-white dark:bg-zinc-800"
            value={form.status ? "true" : "false"}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value === "true" })
            }
          >
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
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
