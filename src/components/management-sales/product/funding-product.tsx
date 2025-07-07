"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import FundingProductForm from "@/components/formModal/funding-product-form";
import useModal from "@/hooks/use-modal";
import { FundingProduct } from "@/types/sales-manage";

import {
  useCreateFundingProductMutation,
  useDeleteFundingProductMutation,
  useGetFundingProductsQuery,
  useUpdateFundingProductMutation,
} from "@/services/product-services/fundingproduct.service";

export default function FundingProductPage() {
  const [newProduct, setNewProduct] = useState<Partial<FundingProduct>>({});
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"semua" | "aktif" | "tidak">(
    "semua"
  );
  const [page, setPage] = useState(1);
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetFundingProductsQuery({
    page,
    paginate: 10,
  });

  const [createProduct] = useCreateFundingProductMutation();
  const [updateProduct] = useUpdateFundingProductMutation();
  const [deleteProduct] = useDeleteFundingProductMutation();

  const handleSubmit = async () => {
    const payload = {
      name: newProduct.name ?? "",
      description: newProduct.description ?? "",
      minimum_amount: Number(newProduct.minimum_amount),
      maximum_amount: Number(newProduct.maximum_amount),
      interest_rate: Number(newProduct.interest_rate),
      eligibility_criteria: newProduct.eligibility_criteria ?? "",
      status: !!newProduct.status,
    };

    try {
      if (editingProductId !== null) {
        await updateProduct({ id: editingProductId, payload });
      } else {
        await createProduct(payload);
      }
      setNewProduct({});
      setEditingProductId(null);
      closeModal();
      refetch();
    } catch (err) {
      console.error("Gagal simpan produk:", err);
    }
  };

  const handleEdit = (product: FundingProduct) => {
    setNewProduct({
      ...product,
      interest_rate: product.interest_rate,
      status: Boolean(product.status),
    });
    setEditingProductId(product.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?"))
      return;

    try {
      await deleteProduct(id);
      refetch();
    } catch (err) {
      console.error("Gagal hapus produk:", err);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await updateProduct({ id, payload: { status: !currentStatus } });
      refetch();
    } catch (err) {
      console.error("Gagal mengubah status produk:", err);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "semua" | "aktif" | "tidak";
    setFilterStatus(value);
  };
  

  const products = data?.data || [];
  const lastPage = data?.last_page || 1;
  const perPage = data?.per_page || 10;

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "semua" ||
      (filterStatus === "aktif" && p.status === true) ||
      (filterStatus === "tidak" && p.status === false);
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Transaksi Product</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari nama produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex items-center gap-2">
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={filterStatus}
            onChange={handleStatusChange}
          >
            <option value="semua">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="tidak">Tidak Aktif</option>
          </select>

          <Button
            onClick={() => {
              setNewProduct({});
              setEditingProductId(null);
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
                <th className="px-4 py-2 font-medium">No</th>
                <th className="px-4 py-2 font-medium">Nama Marketing</th>
                <th className="px-4 py-2 font-medium">Nama Product</th>
                <th className="px-4 py-2 font-medium">Nominal</th>
                <th className="px-4 py-2 font-medium">Fee Marketing</th>
                <th className="px-4 py-2 font-medium">Dibayar</th>
                <th className="px-4 py-2 font-medium">Sisa</th>
                <th className="px-4 py-2 font-medium">Tanggal Transaksi</th>
                <th className="px-4 py-2 font-medium">Tanggal Deadline</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center p-4 text-muted-foreground animate-pulse"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Tidak ada produk yang cocok.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, idx) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-4 py-2">
                      {(page - 1) * perPage + idx + 1}
                    </td>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.description}</td>
                    <td className="px-4 py-2">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(product.minimum_amount)}{" "}
                      -{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(product.maximum_amount)}
                    </td>
                    <td className="px-4 py-2">{product.interest_rate}%</td>
                    <td className="px-4 py-2">{product.interest_rate}%</td>
                    <td className="px-4 py-2">{product.interest_rate}%</td>
                    <td className="px-4 py-2">{product.interest_rate}%</td>
                    <td className="px-4 py-2">
                      {product.eligibility_criteria}
                    </td>
                    <td className="px-4 py-2">
                      <Badge
                        variant={product.status ? "success" : "destructive"}
                        className="cursor-pointer"
                        onClick={() => toggleStatus(product.id, product.status)}
                      >
                        {product.status ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        Hapus
                      </Button>
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

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <FundingProductForm
            form={newProduct}
            setForm={setNewProduct}
            onCancel={closeModal}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}
