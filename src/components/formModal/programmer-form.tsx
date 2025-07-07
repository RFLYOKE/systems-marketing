"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGetSkillsQuery } from "@/services/programmer.service";
import { Skill } from "@/types/skill";
import MultiSelect from "@/components/ui/multi-select"; // import komponen MultiSelect

interface ProgrammerFormProps {
  form: FormData;
  setForm: (data: FormData) => void;
  onCancel: () => void;
  onSubmit: () => void;
  editingId: number | null;
}

export default function ProgrammerForm({
  form,
  setForm,
  onCancel,
  onSubmit,
  editingId,
}: ProgrammerFormProps) {
  const { data: skillResponse, isLoading: loadingSkills } = useGetSkillsQuery({
    page: 1,
    paginate: 100,
    search: "",
  });

  const skills: Skill[] = skillResponse?.skills ?? [];
  const skillOptions = skills.map((skill) => ({
    label: skill.name,
    value: skill.id.toString(),
    group: "Lainnya",
  }));

  const getFormValue = (key: string): string => {
    return form.get(key)?.toString() || "";
  };

  const getFormArray = (key: string): string[] => {
    return form.getAll(key).map((val) => val.toString());
  };

  const updateFormValue = (key: string, value: string | File) => {
    const newForm = new FormData();
    for (const [existingKey, existingValue] of form.entries()) {
      if (existingKey !== key && existingKey !== `${key}[]`) {
        newForm.append(existingKey, existingValue);
      }
    }
    newForm.append(key, value);
    setForm(newForm);
  };

  const updateSkills = (values: string[]) => {
    const newForm = new FormData();
    for (const [existingKey, existingValue] of form.entries()) {
      if (!existingKey.startsWith("skills")) {
        newForm.append(existingKey, existingValue);
      }
    }
    values.forEach((val) => newForm.append("skills[]", val));
    setForm(newForm);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormValue("cv", file);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit Programmer" : "Tambah Programmer"}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1">
          <Label>Nama Lengkap</Label>
          <Input
            value={getFormValue("name")}
            onChange={(e) => updateFormValue("name", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Email</Label>
          <Input
            type="email"
            value={getFormValue("email")}
            onChange={(e) => updateFormValue("email", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Whatsapp</Label>
          <Input
            value={getFormValue("whatsapp")}
            onChange={(e) => updateFormValue("whatsapp", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Pendidikan</Label>
          <Input
            value={getFormValue("education")}
            onChange={(e) => updateFormValue("education", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Alamat</Label>
          <Input
            value={getFormValue("address")}
            onChange={(e) => updateFormValue("address", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Jenis Kelamin</Label>
          <select
            value={getFormValue("gender")}
            onChange={(e) => updateFormValue("gender", e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
          >
            <option value="">Pilih</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Tempat Lahir</Label>
          <Input
            value={getFormValue("birth_place")}
            onChange={(e) => updateFormValue("birth_place", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Tanggal Lahir</Label>
          <Input
            type="date"
            value={getFormValue("birth_date")}
            onChange={(e) => updateFormValue("birth_date", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Kampus</Label>
          <Input
            value={getFormValue("university")}
            onChange={(e) => updateFormValue("university", e.target.value)}
          />
        </div>

        {/* Multi Skill */}
        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Skills</Label>
          {loadingSkills ? (
            <p className="text-sm text-muted-foreground">
              Memuat daftar skill...
            </p>
          ) : (
            <MultiSelect
              options={skillOptions}
              selected={getFormArray("skills[]")}
              onChange={updateSkills}
              placeholder="Pilih minimal 2 skill"
              minSelect={2}
            />
          )}
        </div>

        {/* CV */}
        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <Label>Upload CV</Label>
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          {getFormValue("cv") && (
            <p className="text-sm text-muted-foreground">
              File terpilih: {getFormValue("cv")}
            </p>
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
