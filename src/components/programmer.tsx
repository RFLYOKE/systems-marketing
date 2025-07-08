"use client";

import { useEffect, useState, useCallback } from "react";
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
  useGetProgrammerByIdQuery,
} from "@/services/programmer.service";
import Swal from "sweetalert2";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export default function ProgrammerPage() {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormData>(new FormData());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const { isOpen, openModal, closeModal } = useModal();
  const [hasInitializedForm, setHasInitializedForm] = useState(false);

  const { data: selectedProgrammer, isFetching: isFetchingProgrammer } =
    useGetProgrammerByIdQuery(editingId!, {
      skip: editingId === null,
      refetchOnMountOrArgChange: true,
    });

  const { data, isLoading, refetch } = useGetProgrammersQuery({
    page,
    paginate: 10,
    search,
  });

  const [createProgrammer, { isLoading: isLoadingCreate }] =
    useCreateProgrammerMutation();
  const [updateProgrammer, { isLoading: isLoadingUpdate }] =
    useUpdateProgrammerMutation();
  const [deleteProgrammer] = useDeleteProgrammerMutation();

  const memoizedOpenModal = useCallback(() => {
    openModal();
  }, [openModal]);

  const memoizedRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (
      selectedProgrammer &&
      editingId !== null &&
      !isFetchingProgrammer &&
      !hasInitializedForm
    ) {
      const newForm = new FormData();
      newForm.set("id", selectedProgrammer.id.toString());
      newForm.set("name", selectedProgrammer.name);
      newForm.set("email", selectedProgrammer.email);
      newForm.set("whatsapp", selectedProgrammer.whatsapp ?? "");
      newForm.set("education", selectedProgrammer.education ?? "");
      newForm.set("address", selectedProgrammer.address);
      newForm.set("gender", selectedProgrammer.gender ?? "");
      newForm.set("birth_place", selectedProgrammer.birth_place ?? "");
      newForm.set("birth_date", selectedProgrammer.birth_date ?? "");
      newForm.set("university", selectedProgrammer.university ?? "");

      // Bersihkan skills[] sebelum isi ulang
      if (Array.isArray(selectedProgrammer.skills)) {
        selectedProgrammer.skills.forEach((skill) =>
          newForm.append("skills[]", String(skill.id))
        );
      }

      setForm(newForm);
      setHasInitializedForm(true);
      memoizedOpenModal();
    }
  }, [
    selectedProgrammer,
    editingId,
    isFetchingProgrammer,
    hasInitializedForm,
    memoizedOpenModal,
  ]);

  const SkillNames = ({ programmerId }: { programmerId: number }) => {
    const { data, isLoading } = useGetProgrammerByIdQuery(programmerId, {
      refetchOnMountOrArgChange: true,
    });

    if (isLoading) return <span>Memuat...</span>;
    if (!data?.skills || data.skills.length === 0) return <span>-</span>;

    return <span>{data.skills.map((s) => s.name).join(", ")}</span>;
  };  

  const programmers = data?.data || [];
  const lastPage = data?.last_page || 1;
  const perPage = data?.per_page || 10;

  const handleSubmit = async () => {
    try {
      if (editingId !== null) {
        await updateProgrammer({ id: editingId, payload: form }).unwrap();
        await Swal.fire(
          "Berhasil",
          "Data programmer berhasil diperbarui.",
          "success"
        );
      } else {
        await createProgrammer(form).unwrap();
        await Swal.fire(
          "Berhasil",
          "Data programmer berhasil ditambahkan.",
          "success"
        );
      }

      setForm(new FormData());
      setEditingId(null);
      setHasInitializedForm(false);
      closeModal();
      memoizedRefetch();
    } catch (err: unknown) {
      const error = err as FetchBaseQueryError & {
        data?: {
          message?: string;
          errors?: Record<string, string[]>;
        };
      };

      if (error?.status === 422) {
        const errorObj = error.data?.errors;
        const defaultMsg = error.data?.message || "Validasi gagal.";
        let detailedErrors = "";

        if (errorObj && typeof errorObj === "object") {
          detailedErrors = Object.entries(errorObj)
            .map(
              ([field, messages]) =>
                `${field}: ${(messages as string[]).join(", ")}`
            )
            .join("<br>");
        }

        await Swal.fire({
          icon: "error",
          title: "Validasi Gagal",
          html: detailedErrors || defaultMsg,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menyimpan data programmer.",
        });
      }
    }
  };

  const handleEdit = (programmer: Programmer) => {
    setForm(new FormData());
    setEditingId(programmer.id);
    setHasInitializedForm(false);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus data ini?",
      text: "Data yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProgrammer(id).unwrap();
      memoizedRefetch();
      await Swal.fire("Berhasil!", "Data berhasil dihapus.", "success");
    } catch (err) {
      console.error("Gagal menghapus programmer:", err);
      await Swal.fire(
        "Gagal",
        "Terjadi kesalahan saat menghapus data.",
        "error"
      );
    }
  };

  const filteredProgrammers = programmers.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

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
              setHasInitializedForm(false);
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
                <th className="px-4 py-2">Tempat Lahir</th>
                <th className="px-4 py-2">Tanggal Lahir</th>
                <th className="px-4 py-2">Kampus</th>
                <th className="px-4 py-2">CV</th>
                <th className="px-4 py-2">Skills</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={12} className="text-center p-4 animate-pulse">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredProgrammers.length > 0 ? (
                filteredProgrammers.map((p, i) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(p)}
                        >
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
                    <td className="px-4 py-2">
                      {(page - 1) * perPage + i + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {p.whatsapp || "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {p.education || "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.address}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {p.gender === "L"
                        ? "Laki-laki"
                        : p.gender === "M"
                        ? "Perempuan"
                        : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {p.birth_place || "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {p.birth_date
                        ? new Date(p.birth_date).toISOString().split("T")[0]
                        : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {p.university || "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {typeof p.cv === "string" ? (
                        <a
                          href={p.cv}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Lihat CV
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <SkillNames programmerId={p.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="text-center p-4">
                    Tidak ada data programmer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>

        <div className="p-4 flex items-center justify-between gap-2 bg-muted">
          <div className="text-sm text-muted-foreground">
            Halaman <strong>{page}</strong> dari <strong>{lastPage}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              variant="outline"
            >
              Sebelumnya
            </Button>
            <Button
              disabled={page >= lastPage}
              onClick={() => setPage((p) => p + 1)}
              variant="outline"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          {isFetchingProgrammer && editingId !== null && !selectedProgrammer ? (
            <div className="bg-white dark:bg-zinc-900 text-center p-6 rounded-lg">
              <p className="text-sm text-muted-foreground animate-pulse">
                Memuat detail programmer...
              </p>
            </div>
          ) : (
            <ProgrammerForm
              form={form}
              setForm={setForm}
              onCancel={() => {
                setForm(new FormData());
                setEditingId(null);
                setHasInitializedForm(false);
                closeModal();
              }}
              onSubmit={handleSubmit}
              isLoading={isLoadingCreate || isLoadingUpdate}
              editingId={editingId}
            />
          )}
        </div>
      )}
    </div>
  );
}