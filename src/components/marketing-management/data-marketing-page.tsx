"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MarketingForm from "@/components/formModal/data-market-form";
import useModal from "@/hooks/use-modal";
import { Marketing } from "@/types/marketing";
import Swal from "sweetalert2";
import {
  useGetMarketingsQuery,
  useCreateMarketingMutation,
  useUpdateMarketingMutation,
  useDeleteMarketingMutation,
} from "@/services/marketing.service";

export default function DataMarketingPage() {
  const [newData, setNewData] = useState<Partial<Marketing>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetMarketingsQuery({
    page,
    paginate: 10,
    search,
  });

  const [createMarketing] = useCreateMarketingMutation();
  const [updateMarketing] = useUpdateMarketingMutation();
  const [deleteMarketing] = useDeleteMarketingMutation();

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.entries(newData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "cv") {
          if (value instanceof File) {
            formData.append("cv", value);
          }
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    try {
      if (editingId !== null) {
        await updateMarketing({ id: editingId, payload: formData }).unwrap();
        Swal.fire("Berhasil", "Data marketing berhasil diperbarui!", "success");
      } else {
        await createMarketing(formData).unwrap();
        Swal.fire(
          "Berhasil",
          "Data marketing berhasil ditambahkan!",
          "success"
        );
      }

      setNewData({});
      setEditingId(null);
      closeModal();
      refetch();
    } catch (err) {
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data", "error");
      console.error("Gagal simpan data marketing:", err);
    }
  };  

  const handleEdit = (marketing: Marketing) => {
    setNewData({ ...marketing });
    setEditingId(marketing.id);
    openModal();
  };  

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus data?",
      text: "Data marketing yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteMarketing(id).unwrap();
      Swal.fire("Dihapus!", "Data marketing berhasil dihapus.", "success");
      refetch();
    } catch (err) {
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data", "error");
      console.error("Gagal hapus data:", err);
    }
  };

  const marketings = data?.data || [];
  const lastPage = data?.last_page || 1;
  const perPage = data?.per_page || 10;

  const filtered = marketings.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Data Marketing</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari nama marketing..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <Button
          onClick={() => {
            setNewData({});
            setEditingId(null);
            openModal();
          }}
        >
          + Tambah Marketing
        </Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Aksi</th>
                <th className="px-4 py-2 font-medium">No</th>
                <th className="px-4 py-2 font-medium">Nama</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">WhatsApp</th>
                <th className="px-4 py-2 font-medium">Pendidikan</th>
                <th className="px-4 py-2 font-medium">Alamat</th>
                <th className="px-4 py-2 font-medium">Gender</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">
                  Tempat, Tanggal Lahir
                </th>
                <th className="px-4 py-2 font-medium">Universitas</th>
                <th className="px-4 py-2 font-medium">CV</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="text-center p-4 animate-pulse">
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center p-4">
                    Tidak ada data marketing.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2 space-x-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {(page - 1) * perPage + idx + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.email}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.whatsapp}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.education}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.address}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.gender === "L"
                        ? "Laki-laki"
                        : item.gender === "M"
                        ? "Perempuan"
                        : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.birth_place},{" "}
                      {item.birth_date
                        ? new Date(item.birth_date).toISOString().split("T")[0]
                        : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.university}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {typeof item.cv === "string" ? (
                        <a
                          href={item.cv}
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
                  </tr>
                ))
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
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              disabled={page >= lastPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <MarketingForm
            form={newData}
            setForm={setNewData}
            onCancel={closeModal}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}
