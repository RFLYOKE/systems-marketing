"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import useModal from "@/hooks/use-modal";
import LendingProductForm from "@/components/formModal/lending-product-form";
import { LendingProduct } from "@/types/sales-manage";
import {
  useGetLendingProductsQuery,
  useCreateLendingProductMutation,
  useUpdateLendingProductMutation,
  useDeleteLendingProductMutation,
} from "@/services/product-services/lendingproduct.service";

export default function LendingProductPage() {
  const [form, setForm] = useState<Partial<LendingProduct>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"semua" | "aktif" | "tidak">(
    "semua"
  );
  const [page, setPage] = useState(1);
  const paginate = 10;
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetLendingProductsQuery({
    page,
    paginate,
  });
  const [createProduct] = useCreateLendingProductMutation();
  const [updateProduct] = useUpdateLendingProductMutation();
  const [deleteProduct] = useDeleteLendingProductMutation();

  const handleSubmit = async () => {
    const payload = {
      name: form.name ?? "",
      description: form.description ?? "",
      loan_amount_min: Number(form.loan_amount_min ?? 0),
      loan_amount_max: Number(form.loan_amount_max ?? 0),
      interest_rate: Number(form.interest_rate ?? 0),
      repayment_terms: form.repayment_terms ?? "",
      eligibility_criteria: form.eligibility_criteria ?? "",
      status: !!form.status,
    };

    try {
      if (editingId !== null) {
        await updateProduct({ id: editingId, payload });
      } else {
        await createProduct(payload);
      }
      setForm({});
      setEditingId(null);
      closeModal();
      refetch();
    } catch (err) {
      console.error("Gagal menyimpan produk:", err);
    }
  };

  const handleEdit = (product: LendingProduct) => {
    setForm(product);
    setEditingId(product.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Yakin ingin menghapus produk ini?");
    if (!confirmed) return;

    try {
      await deleteProduct(id);
      refetch();
    } catch (err) {
      console.error("Gagal menghapus produk:", err);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await updateProduct({ id, payload: { status: !currentStatus } });
      refetch();
    } catch (err) {
      console.error("Gagal mengubah status:", err);
    }
  };

  const filtered = (data?.data || []).filter((p) => {
    const match = p.name.toLowerCase().includes(search.toLowerCase());
    const statusMatch =
      filterStatus === "semua" ||
      (filterStatus === "aktif" && p.status) ||
      (filterStatus === "tidak" && !p.status);
    return match && statusMatch;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Transaksi Jasa</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari nama produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex gap-2 items-center">
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "semua" | "aktif" | "tidak")
            }
          >
            <option value="semua">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="tidak">Tidak Aktif</option>
          </select>
          <Button
            onClick={() => {
              setForm({});
              setEditingId(null);
              openModal();
            }}
          >
            + Tambah Transaksi
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama Marketing</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2">Judul</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2">Nominal</th>
                <th className="px-4 py-2">Fee Marketing</th>
                <th className="px-4 py-2">Dibayar</th>
                <th className="px-4 py-2">Sisa</th>
                <th className="px-4 py-2">Tanggal Transaksi</th>
                <th className="px-4 py-2">Tanggal Deadline</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={13}
                    className="text-center p-4 animate-pulse text-muted-foreground"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={13}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Tidak ada produk yang cocok.
                  </td>
                </tr>
              ) : (
                filtered.map((p, index) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">
                      {(page - 1) * paginate + index + 1}
                    </td>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.description}</td>
                    <td className="px-4 py-2">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(p.loan_amount_min)}{" "}
                      -{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(p.loan_amount_max)}
                    </td>

                    <td className="px-4 py-2">{p.interest_rate}%</td>
                    <td className="px-4 py-2">{p.repayment_terms}</td>
                    <td className="px-4 py-2">{p.eligibility_criteria}</td>
                    <td className="px-4 py-2">{p.eligibility_criteria}</td>
                    <td className="px-4 py-2">{p.eligibility_criteria}</td>
                    <td className="px-4 py-2">{p.eligibility_criteria}</td>
                    <td className="px-4 py-2">{p.eligibility_criteria}</td>
                    <td className="px-4 py-2">
                      <Badge
                        variant={p.status ? "success" : "destructive"}
                        className="cursor-pointer"
                        onClick={() => toggleStatus(p.id, p.status)}
                      >
                        {p.status ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center  space-x-2">
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
        {/* Pagination */}
        <div className="flex justify-between items-center p-4 bg-muted">
          <span className="text-sm text-muted-foreground">
            Halaman {data?.current_page} dari {data?.last_page}
          </span>
          <div className="space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Sebelumnya
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setPage((prev) =>
                  Math.min(prev + 1, data?.last_page || prev + 1)
                )
              }
              disabled={page === data?.last_page}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <LendingProductForm
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
