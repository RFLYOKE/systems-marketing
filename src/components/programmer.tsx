"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useModal from "@/hooks/use-modal";
import ProgrammerForm from "@/components/formModal/programmer-form";
import { Programmer } from "@/types/programmer";
import {
  useGetProgrammersQuery,
  useCreateProgrammerMutation,
  useUpdateProgrammerMutation,
  useDeleteProgrammerMutation,
  // useGetSkillsQuery,
} from "@/services/programmer.service";
import Swal from "sweetalert2";

export default function ProgrammerPage() {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormData>(new FormData());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetProgrammersQuery({
    page,
    paginate: 10,
    search,
  });

  // const { data: skillResponse } = useGetSkillsQuery({
  //   page: 1,
  //   paginate: 100,
  //   search: "",
  // });

  // const allSkills = skillResponse?.skills ?? [];
  // const getSkillNames = (ids: number[]) =>
  //   ids
  //     .map((id) => allSkills.find((s) => s.id === id)?.name)
  //     .filter(Boolean)
  //     .join(", ");

  const [createProgrammer] = useCreateProgrammerMutation();
  const [updateProgrammer] = useUpdateProgrammerMutation();
  const [deleteProgrammer] = useDeleteProgrammerMutation();

  const programmers = data?.data || [];
  const lastPage = data?.last_page || 1;
  const totalData = data?.total || 0;
  const perPage = data?.per_page || 10;
  const totalPages = Math.ceil(totalData / perPage);

  const handleSubmit = async () => {
    try {
      if (editingId !== null) {
        await updateProgrammer({ id: editingId, payload: form }).unwrap();
        Swal.fire(
          "Berhasil",
          "Data programmer berhasil diperbarui.",
          "success"
        );
      } else {
        await createProgrammer(form).unwrap();
        Swal.fire(
          "Berhasil",
          "Data programmer berhasil ditambahkan.",
          "success"
        );
      }
      setForm(new FormData());
      setEditingId(null);
      closeModal();
      refetch();
    } catch (error) {
      console.error("Gagal simpan data:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  };

  const handleEdit = (p: Programmer) => {
    const newForm = new FormData();
    newForm.set("name", p.name);
    newForm.set("email", p.email);
    newForm.set("whatsapp", p.whatsapp ?? "");
    newForm.set("education", p.education ?? "");
    newForm.set("address", p.address);
    newForm.set("gender", p.gender ?? "");
    newForm.set("birth_place", p.birth_place ?? "");
    newForm.set("birth_date", p.birth_date ?? "");
    newForm.set("university", p.university ?? "");

    if (Array.isArray(p.skills)) {
      p.skills.forEach((skillId) => {
        newForm.append("skills[]", String(skillId));
      });
    }

    setForm(newForm);
    setEditingId(p.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Programmer?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteProgrammer(id).unwrap();
        refetch();
        Swal.fire("Berhasil", "Data berhasil dihapus.", "success");
      } catch (error) {
        console.error("Gagal hapus data:", error);
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Programmer</h1>

      <div className="flex flex-wrap items-center gap-2 justify-between">
        <Input
          placeholder="Cari nama atau email programmer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setForm(new FormData());
              setEditingId(null);
              openModal();
            }}
          >
            + Tambah Programmer
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm" suppressHydrationWarning>
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Whatsapp</th>
                <th className="px-4 py-2">Pendidikan</th>
                <th className="px-4 py-2">Alamat</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2 whitespace-nowrap">Tempat Lahir</th>
                <th className="px-4 py-2 whitespace-nowrap">Tanggal Lahir</th>
                <th className="px-4 py-2">Kampus</th>
                {/* <th className="px-4 py-2">Skills</th> */}
                <th className="px-4 py-2">CV</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={13}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : programmers.length > 0 ? (
                programmers.map((p, index) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => handleEdit(p)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(p.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-2">{(page - 1) * 10 + index + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {p.whatsapp}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {p.education}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.address}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {p.gender ?? "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {p.birth_place ?? "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {p.birth_date
                        ? new Date(p.birth_date).toISOString().split("T")[0]
                        : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {p.university ?? "-"}
                    </td>
                    {/* <td className="px-4 py-2 whitespace-nowrap">
                      {Array.isArray(p.skills) && p.skills.length > 0
                        ? getSkillNames(p.skills as number[])
                        : "-"}
                    </td> */}
                    <td className="px-4 py-2">
                      <Button variant="link" size="sm">
                        Lihat CV
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={13}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Tidak ada data programmer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>

        <div className="p-4 flex items-center justify-between gap-2 bg-muted">
          <div className="text-sm text-muted-foreground">
            Halaman <strong>{page}</strong> dari <strong>{totalPages}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
              variant="outline"
            >
              Sebelumnya
            </Button>
            <Button
              disabled={page >= lastPage}
              onClick={() => setPage((prev) => prev + 1)}
              variant="outline"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <ProgrammerForm
            form={form}
            setForm={setForm}
            onCancel={closeModal}
            onSubmit={handleSubmit}
            editingId={editingId}
          />
        </div>
      )}
    </div>
  );
}
