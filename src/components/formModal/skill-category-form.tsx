"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skill } from "@/types/skill";
import { Textarea } from "../ui/textarea";

interface SkillCategoryFormProps {
  form: Partial<Skill>;
  setForm: (data: Partial<Skill>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  editingId: number | null;
}

export default function SkillCategoryForm({
  form,
  setForm,
  onCancel,
  onSubmit,
  editingId,
}: SkillCategoryFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit Skill" : "Tambah Skill"}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1 sm:col-span-2">
          <Label>Nama Skill</Label>
          <Input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-y-1 sm:col-span-2">
          <Label>Deskripsi</Label>
          <Textarea
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-y-1 sm:col-span-2">
          <Label>Status</Label>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={
              form.status === true
                ? "true"
                : form.status === false
                ? "false"
                : ""
            }
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