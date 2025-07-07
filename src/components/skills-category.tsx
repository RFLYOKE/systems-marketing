"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import useModal from "@/hooks/use-modal";
import SkillCategoryForm from "./formModal/skill-category-form";
import { Skill } from "@/types/skill";
import {
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} from "@/services/skillscategory.service";
import Swal from "sweetalert2";

export default function SkillsCategoryPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [form, setForm] = useState<Partial<Skill>>({
    status: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetSkillsQuery({
    page,
    paginate: 10,
  });

  const [createSkill] = useCreateSkillMutation();
  const [updateSkill] = useUpdateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();

  const skills = data?.data || [];
  const lastPage = data?.last_page || 1;
  const totalData = data?.total || 0;
  const perPage = data?.per_page || 10;
  const totalPages = Math.ceil(totalData / perPage);

  const handleSubmit = async () => {
    try {
      if (editingId !== null) {
        await updateSkill({ id: editingId, payload: form }).unwrap();
        Swal.fire("Berhasil", "Skill berhasil diperbarui", "success");
      } else {
        await createSkill(form).unwrap();
        Swal.fire("Berhasil", "Skill berhasil ditambahkan", "success");
      }
      setForm({ status: true });
      setEditingId(null);
      closeModal();
      refetch();
    } catch (error) {
      console.error("Gagal simpan data:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data", "error");
    }
  };  

  const handleEdit = (c: Skill) => {
    setForm(c);
    setEditingId(c.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data skill ini akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
  
    if (confirm.isConfirmed) {
      try {
        await deleteSkill(id).unwrap();
        Swal.fire("Berhasil", "Skill berhasil dihapus", "success");
        refetch();
      } catch (error) {
        console.error("Gagal hapus skill:", error);
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data", "error");
      }
    }
  };

  const filtered = skills.filter((c) => {
    const keyword = search.toLowerCase();
    const matchName = c.name.toLowerCase().includes(keyword);
    const matchStatus =
      filterStatus === "semua" ||
      (filterStatus === "Aktif" && c.status === true) ||
      (filterStatus === "Tidak Aktif" && c.status === false);
    return matchName && matchStatus;
  });

  const limitWords = (text: string, maxWords = 7) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Skill</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
        <Input
          placeholder="Cari nama skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex gap-2">
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
          <Button
            onClick={() => {
              setForm({ status: true});
              setEditingId(null);
              openModal();
            }}
          >
            + Tambah Skill
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm" suppressHydrationWarning>
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Memuat data skill...
                  </td>
                </tr>
              ) : (
                <>
                  {filtered.map((c, index) => (
                    <tr key={c.id} className="border-t">
                      <td className="px-4 py-2">
                        {(page - 1) * 10 + index + 1}
                      </td>
                      <td className="px-4 py-2">{c.name}</td>
                      <td className="px-4 py-2">{limitWords(c.description)}</td>
                      <td className="px-4 py-2">
                        <Badge variant={c.status ? "success" : "destructive"}>
                          {c.status ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 flex space-x-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleEdit(c)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(c.id)}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center p-4 text-muted-foreground"
                      >
                        Tidak ada data skill.
                      </td>
                    </tr>
                  )}
                </>
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
          <SkillCategoryForm
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
