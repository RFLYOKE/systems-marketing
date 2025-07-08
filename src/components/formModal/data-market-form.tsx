"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Marketing } from "@/types/marketing";

interface MarketingFormProps {
  form: Partial<Marketing>;
  setForm: (form: Partial<Marketing>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function MarketingForm({
  form,
  setForm,
  onCancel,
  onSubmit,
}: MarketingFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-3xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Form Marketing</h2>
        <Button variant="ghost" onClick={onCancel} aria-label="Tutup">
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1">
          <Label>Nama</Label>
          <Input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email || ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>No. WhatsApp</Label>
          <Input
            value={form.whatsapp || ""}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Pendidikan</Label>
          <Input
            value={form.education || ""}
            onChange={(e) => setForm({ ...form, education: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Tempat Lahir</Label>
          <Input
            value={form.birth_place || ""}
            onChange={(e) => setForm({ ...form, birth_place: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Tanggal Lahir</Label>
          <Input
            type="date"
            value={form.birth_date || ""}
            onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Jenis Kelamin</Label>
          <select
            required
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={form.gender || ""}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="" disabled>
              Pilih Jenis Kelamin
            </option>
            <option value="L">Laki-laki</option>
            <option value="M">Perempuan</option>
          </select>
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Universitas</Label>
          <Input
            value={form.university || ""}
            onChange={(e) => setForm({ ...form, university: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Alamat</Label>
          <Input
            value={form.address || ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Upload CV</Label>
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setForm({ ...form, cv: file });
              }
            }}
          />
          {form.cv && typeof form.cv === "string" && (
            <a
              href={form.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline mt-1"
            >
              Lihat CV Saat Ini
            </a>
          )}
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