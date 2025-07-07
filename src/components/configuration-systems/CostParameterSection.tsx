"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import FormCreateCostParameter from "@/components/formModal/form-create-param";
import { CostParameter } from "@/types/parameter";
import { useRouter } from "next/navigation";
import useModal from "@/hooks/use-modal";
import { useCostParameterStore } from "@/store/costParameterStore";

const dummyData: CostParameter[] = [
  {
    id: "P001",
    productName: "Produk A",
    costType: "Tetap",
    costValue: "Rp100.000",
    startDate: "01-07-2025",
    endDate: "31-12-2025",
  },
  {
    id: "P002",
    productName: "Produk B",
    costType: "Persentase",
    costValue: "5%",
    startDate: "01-08-2025",
    endDate: "31-12-2025",
  },
  {
    id: "P003",
    productName: "Produk C",
    costType: "Tetap",
    costValue: "Rp50.000",
    startDate: "15-07-2025",
    endDate: "31-12-2025",
  },
  {
    id: "P004",
    productName: "Produk D",
    costType: "Persentase",
    costValue: "10%",
    startDate: "01-09-2025",
    endDate: "31-12-2025",
  },
  {
    id: "P005",
    productName: "Produk E",
    costType: "Tetap",
    costValue: "Rp200.000",
    startDate: "01-07-2025",
    endDate: "31-12-2025",
  },
  {
    id: "P006",
    productName: "Produk F",
    costType: "Tetap",
    costValue: "Rp150.000",
    startDate: "10-07-2025",
    endDate: "31-12-2025",
  },
];

const ITEMS_PER_PAGE = 5;

export default function CostParameterSection() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingData, setEditingData] = useState<CostParameter | null>(null);
  const { data, setData } = useCostParameterStore();

  const {
    isOpen: isCreateModalOpen,
    openModal: openCreateModal,
    closeModal: closeCreateModal,
  } = useModal();

  const router = useRouter();

  useEffect(() => {
    if (data.length === 0) {
      setData(dummyData);
    }
  }, [data, setData]);

  const filtered = data.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleCreate = () => {
    setEditingData(null);
    openCreateModal();
  };

  const handleEdit = (item: CostParameter) => {
    setEditingData(item);
    openCreateModal();
  };

  const handleDelete = (id: string) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
  };

  const handleSubmit = (newData: CostParameter) => {
    const isEdit = data.some((item) => item.id === newData.id);
    const updatedData = isEdit
      ? data.map((item) => (item.id === newData.id ? newData : item))
      : [...data, newData];
    setData(updatedData);
  };

  const handleGlobalHistory = () => {
    router.push("/config-system/riwayat");
  };

  return (
    <section className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Pengaturan Parameter (Biaya)
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Input
          placeholder="Cari nama produk..."
          value={search}
          onChange={handleSearch}
          className="max-w-sm"
        />

        <div className="flex gap-2">
          <Button variant="default" onClick={handleCreate}>
            Buat Parameter Biaya Baru
          </Button>
          <Button variant="outline" onClick={handleGlobalHistory}>
            Riwayat Semua
          </Button>
        </div>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-2">ID Parameter</th>
              <th className="px-4 py-2">Nama Produk</th>
              <th className="px-4 py-2">Jenis Biaya</th>
              <th className="px-4 py-2">Nilai Biaya</th>
              <th className="px-4 py-2">Tanggal Efektif</th>
              <th className="px-4 py-2">Tanggal Akhir</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-muted/40 transition-colors"
              >
                <td className="px-4 py-2 font-medium">{item.id}</td>
                <td className="px-4 py-2">{item.productName}</td>
                <td className="px-4 py-2">{item.costType}</td>
                <td className="px-4 py-2">{item.costValue}</td>
                <td className="px-4 py-2">{item.startDate}</td>
                <td className="px-4 py-2">{item.endDate}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-4">
        <span className="text-sm text-muted-foreground">
          Menampilkan {filtered.length === 0 ? 0 : startIdx + 1}–
          {Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} dari{" "}
          {filtered.length} data
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Sebelumnya
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleNext}
            disabled={
              currentPage === totalPages || filtered.length <= ITEMS_PER_PAGE
            }
          >
            Selanjutnya
          </Button>
        </div>
      </div>

      {isCreateModalOpen && (
        <FormCreateCostParameter
          onClose={closeCreateModal}
          onSubmit={handleSubmit}
          initialData={editingData || undefined}
        />
      )}
    </section>
  );
}
