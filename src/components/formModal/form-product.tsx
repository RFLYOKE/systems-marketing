"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MultiSelect from "@/components/ui/multi-select";
import { useState } from "react";
import { useGetProgrammersQuery } from "@/services/programmer.service";
import { Programmer } from "@/types/programmer";
import { Textarea } from "../ui/textarea";

interface ProductFormProps {
  form: FormData;
  setForm: (form: FormData) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function ProductForm({
  form,
  setForm,
  onCancel,
  onSubmit,
  isLoading = false,
}: ProductFormProps) {
  const isEdit = form.has("category");

  const [programmerSearch, setProgrammerSearch] = useState("");

  const { data: programmerResponse, isLoading: loadingProgrammers } =
    useGetProgrammersQuery({
      page: 1,
      paginate: 50,
      search: programmerSearch,
    });

  const programmers: Programmer[] = programmerResponse?.data ?? [];

  const getFormValue = (key: string): string => {
    return form.get(key)?.toString() ?? "";
  };

  const updateFormValue = (key: string, value: string | File) => {
    const newForm = new FormData();
    for (const [existingKey, existingValue] of form.entries()) {
      if (existingKey !== key) {
        newForm.append(existingKey, existingValue);
      }
    }
    newForm.append(key, value);
    setForm(newForm);
  };

  const updateProgrammers = (values: string[]) => {
    // Hapus semua programmers[] lama
    const newForm = new FormData();

    // Copy seluruh entry kecuali 'programmers[]'
    form.forEach((value, key) => {
      if (key !== "programmers[]") {
        newForm.append(key, value);
      }
    });

    // Tambahkan nilai baru
    values.forEach((val) => {
      newForm.append("programmers[]", val);
    });

    setForm(newForm);
  };  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormValue("image", file);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Produk" : "Tambah Produk"}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1">
          <Label>Kategori</Label>
          <select
            value={getFormValue("category")}
            onChange={(e) => updateFormValue("category", e.target.value)}
            className="border rounded px-3 py-2 bg-background text-foreground"
          >
            <option value="">-- Pilih Kategori --</option>
            <option value="web-app">Web App</option>
            <option value="website">Website</option>
            <option value="mobile app">Mobile App</option>
          </select>
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Judul</Label>
          <Input
            value={getFormValue("title")}
            onChange={(e) => updateFormValue("title", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Deskripsi</Label>
          <Textarea
            value={getFormValue("description")}
            onChange={(e) => updateFormValue("description", e.target.value)}
            placeholder="Tulis deskripsi produk..."
            rows={4}
          />
        </div>

        {/* Teknologi string biasa */}
        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Teknologi</Label>
          <Input
            value={getFormValue("technology")}
            onChange={(e) => updateFormValue("technology", e.target.value)}
            placeholder="Contoh: PHP,Laravel,Vue.js"
          />
        </div>

        {/* Multi Programmer */}
        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Programmer</Label>
          {loadingProgrammers ? (
            <p className="text-sm text-muted-foreground">
              Memuat daftar programmer...
            </p>
          ) : (
            <MultiSelect
              options={programmers.map((p) => ({
                label: p.name,
                value: p.id.toString(),
                group: "Programmer",
              }))}
              selected={
                form.has("programmers[]")
                  ? (form.getAll("programmers[]") as string[]).map((val) =>
                      val.toString()
                    )
                  : []
              }
              onChange={updateProgrammers}
              placeholder="Pilih programmer"
              minSelect={1}
              searchValue={programmerSearch}
              onSearchChange={setProgrammerSearch}
            />
          )}
        </div>

        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Gambar</Label>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {getFormValue("image") && (
            <p className="text-sm text-muted-foreground">
              File terpilih: {getFormValue("image")}
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Batal
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Loading..." : isEdit ? "Perbarui" : "Simpan"}
        </Button>
      </div>
    </div>
  );
}
