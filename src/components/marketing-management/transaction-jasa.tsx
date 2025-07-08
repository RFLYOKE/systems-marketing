"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import useModal from "@/hooks/use-modal";
import { ServiceTransaction } from "@/types/jasa-transaction";
import ServiceTransactionForm from "@/components/formModal/jasa-transaction-form";
import {
  useGetServiceTransactionsQuery,
  useCreateServiceTransactionMutation,
  useUpdateServiceTransactionMutation,
  useDeleteServiceTransactionMutation,
} from "@/services/transactionjasa.service";
import Swal from "sweetalert2";

type FilterStatus = "semua" | "Aktif" | "Tidak Aktif";

export default function TransactionServicePage() {
  const [form, setForm] = useState<Partial<ServiceTransaction>>({
    status: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("semua");
  const [page, setPage] = useState(1);
  const paginate = 10;
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetServiceTransactionsQuery({
    page: 1,
    paginate: 1000,
    search,
  });

  const [createServiceTransaction] = useCreateServiceTransactionMutation();
  const [updateServiceTransaction] = useUpdateServiceTransactionMutation();
  const [deleteServiceTransaction] = useDeleteServiceTransactionMutation();

  const handleSubmit = async () => {
    try {
      if (editingId !== null) {
        await updateServiceTransaction({
          id: editingId,
          payload: form,
        }).unwrap();
        Swal.fire("Berhasil", "Transaksi berhasil diperbarui.", "success");
      } else {
        await createServiceTransaction(form).unwrap();
        Swal.fire("Berhasil", "Transaksi berhasil ditambahkan.", "success");
      }
      setForm({ status: true });
      setEditingId(null);
      closeModal();
      refetch();
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  };

  const handleEdit = (data: ServiceTransaction) => {
    setForm(data);
    setEditingId(data.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Transaksi?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteServiceTransaction(id).unwrap();
        refetch();
        Swal.fire("Berhasil", "Transaksi berhasil dihapus.", "success");
      } catch (error) {
        console.error("Gagal hapus transaksi:", error);
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  const idrFormat = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  const filteredTransactions = useMemo(() => {
    let trx = data?.data || [];
    if (filterStatus === "Aktif") trx = trx.filter((t) => t.status === true);
    if (filterStatus === "Tidak Aktif")
      trx = trx.filter((t) => t.status === false);
    return trx;
  }, [data?.data, filterStatus]);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * paginate;
    return filteredTransactions.slice(start, start + paginate);
  }, [filteredTransactions, page]);

  const totalPage = Math.ceil(filteredTransactions.length / paginate);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Data Transaksi Jasa</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari nama marketing..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex gap-2">
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          >
            <option value="semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
          <Button
            onClick={() => {
              setForm({ status: true });
              setEditingId(null);
              openModal();
            }}
          >
            + Tambah Data
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Marketing</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2">Judul</th>
                <th className="px-4 py-2">Nominal</th>
                <th className="px-4 py-2">Dibayar</th>
                <th className="px-4 py-2">Sisa</th>
                <th className="px-4 py-2">Fee</th>
                <th className="px-4 py-2">Tgl Transaksi</th>
                <th className="px-4 py-2">Deadline</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={12}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : paginatedTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Tidak ada data transaksi.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((item, i) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">
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
                      {(page - 1) * paginate + i + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.marketing_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.title}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {idrFormat(item.nominal)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {idrFormat(item.dibayar)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {idrFormat(item.sisa)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {idrFormat(item.fee_marketing)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(item.transaction_date).toLocaleDateString(
                        "id-ID"
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(item.deadline_date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-2">
                      <Badge variant={item.status ? "success" : "destructive"}>
                        {item.status ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>

        <div className="p-4 flex items-center justify-between gap-2 bg-muted">
          <div className="text-sm text-muted-foreground">
            Halaman <strong>{page}</strong> dari <strong>{totalPage}</strong>
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
              disabled={page >= totalPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <ServiceTransactionForm
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