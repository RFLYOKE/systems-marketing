"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "@/services/product.service";
import { useGetProgrammersQuery } from "@/services/programmer.service";
import { Product } from "@/types/product";
import useModal from "@/hooks/use-modal";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Swal from "sweetalert2";
import ProductForm from "@/components/formModal/form-product";

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetProductsQuery({
    page,
    paginate: 10,
    search,
  });
  const [createProduct, { isLoading: isLoadingCreate }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: isLoadingUpdate }] =
    useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const { data: programmerResponse, isLoading: loadingProgrammers } =
    useGetProgrammersQuery({
      page: 1,
      paginate: 100, // pastikan cukup banyak agar semua ID bisa dikenali
      search: "",
    });

  const allProgrammers = programmerResponse?.data ?? [];  

  const [formData, setFormData] = useState<FormData>(new FormData());
  const [editingId, setEditingId] = useState<number | null>(null);

  const getProgrammerNames = (ids: (number | string)[]): string => {
    return ids
      .map((id) => {
        const found = allProgrammers.find((p) => p.id === Number(id));
        return found ? `${found.name}` : null;
      })
      .filter(Boolean) // hapus null
      .join(", ");
  };  

  const handleSubmit = async () => {
    try {
      if (editingId !== null) {
        await updateProduct({ id: editingId, payload: formData }).unwrap();
        await Swal.fire("Berhasil", "Produk berhasil diperbarui.", "success");
      } else {
        await createProduct(formData).unwrap();
        await Swal.fire("Berhasil", "Produk berhasil ditambahkan.", "success");
      }

      setFormData(new FormData());
      setEditingId(null);
      closeModal();
      refetch();
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
          text: "Terjadi kesalahan saat menyimpan data produk.",
        });
      }
    }
  };

  const handleEdit = (product: Product) => {
    const newForm = new FormData();
    newForm.set("category", product.category);
    newForm.set("title", product.title);
    newForm.set("description", product.description);
    newForm.set("technology", product.technology);
    if (Array.isArray(product.programmers)) {
      product.programmers.forEach((p) =>
        newForm.append("programmers[]", p.toString())
      );
    }    
    setFormData(newForm);
    setEditingId(product.id);
    openModal();
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
      await deleteProduct(id);
      refetch();
      await Swal.fire("Berhasil!", "Data berhasil dihapus.", "success");
    } catch (err) {
      console.error("Gagal menghapus produk:", err);
      await Swal.fire(
        "Gagal",
        "Terjadi kesalahan saat menghapus data.",
        "error"
      );
    }
  };

  const products = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;
  const perPage = data?.per_page ?? 10;

  const filtered = products.filter(
    (p) =>
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase())
  );

  const limitWords = (text: string, maxWords = 7) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Produk IT</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari kategori / judul produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <Button
          onClick={() => {
            setFormData(new FormData());
            setEditingId(null);
            openModal();
          }}
        >
          + Tambah Data
        </Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Aksi</th>
                <th className="px-4 py-2 font-medium">No</th>
                <th className="px-4 py-2 font-medium">Kategori</th>
                <th className="px-4 py-2 font-medium">Judul</th>
                <th className="px-4 py-2 font-medium">Deskripsi</th>
                <th className="px-4 py-2 font-medium">Teknologi</th>
                <th className="px-4 py-2 font-medium">Programmer</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center p-4 animate-pulse">
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center p-4">
                    Tidak ada data produk.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2 space-x-2">
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
                    </td>
                    <td className="px-4 py-2">
                      {(page - 1) * perPage + idx + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.title}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {limitWords(item.description)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.technology}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap" colSpan={1}>
                      {loadingProgrammers
                        ? "Loading..."
                        : Array.isArray(item.programmers) &&
                          item.programmers.length > 0
                        ? getProgrammerNames(item.programmers)
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>

        {/* Pagination */}
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

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <ProductForm
            form={formData}
            setForm={setFormData}
            onCancel={() => {
              setFormData(new FormData());
              setEditingId(null);
              closeModal();
            }}
            onSubmit={handleSubmit}
            isLoading={isLoadingCreate || isLoadingUpdate}
          />
        </div>
      )}
    </div>
  );
}
