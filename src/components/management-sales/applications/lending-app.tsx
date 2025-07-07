"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import useModal from "@/hooks/use-modal";
import {
  LendingApplication,
  LendingApplicationStatus,
} from "@/types/sales-manage";
import LendingApplicationForm from "@/components/formModal/lending-app-form";
  

export default function LendingApplicationPage() {
  const [applications, setApplications] = useState<LendingApplication[]>([]);
  const [form, setForm] = useState<Partial<LendingApplication>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const { isOpen, openModal, closeModal } = useModal();

  const handleSubmit = () => {
    if (editingId !== null) {
      setApplications(
        applications.map((a) =>
          a.id === editingId ? ({ ...a, ...form } as LendingApplication) : a
        )
      );
    } else {
      const newApp: LendingApplication = {
        id: Date.now(),
        customerName: form.customerName || "",
        product: form.product || "",
        amount: Number(form.amount) || 0,
        date: form.date || new Date().toISOString().split("T")[0],
        status: (form.status as LendingApplicationStatus) || "Tertunda",
        sales: form.sales || "",
        coordinator: form.coordinator || "",
      };
      setApplications([newApp, ...applications]);
    }
    setForm({});
    setEditingId(null);
    closeModal();
  };

  const handleEdit = (app: LendingApplication) => {
    setForm(app);
    setEditingId(app.id);
    openModal();
  };

  const handleDelete = (id: number) => {
    setApplications(applications.filter((a) => a.id !== id));
  };

  const filtered = applications.filter((a) => {
    const match = a.customerName.toLowerCase().includes(search.toLowerCase());
    const statusMatch =
      filterStatus === "semua" ||
      (filterStatus === "aktif" && a.status === "Disetujui") ||
      (filterStatus === "tidak" && a.status === "Ditolak") ||
      (filterStatus === "tertunda" && a.status === "Tertunda");
    return match && statusMatch;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Aplikasi Pinjaman</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari nama pelanggan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex gap-2 items-center">
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="semua">Semua Status</option>
            <option value="tertunda">Tertunda</option>
            <option value="aktif">Disetujui</option>
            <option value="tidak">Ditolak</option>
          </select>
          <Button
            onClick={() => {
              setForm({});
              setEditingId(null);
              openModal();
            }}
          >
            + Tambah Aplikasi
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Nama Pelanggan</th>
                <th className="px-4 py-2">Produk</th>
                <th className="px-4 py-2">Jumlah</th>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Sales</th>
                <th className="px-4 py-2">Koordinator</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2">{a.customerName}</td>
                  <td className="px-4 py-2">{a.product}</td>
                  <td className="px-4 py-2">{a.amount}</td>
                  <td className="px-4 py-2">{a.date}</td>
                  <td className="px-4 py-2">
                    <Badge
                      variant={
                        a.status === "Disetujui"
                          ? "success"
                          : a.status === "Ditolak"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {a.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2">{a.sales}</td>
                  <td className="px-4 py-2">{a.coordinator}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(a)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(a.id)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center p-4 text-muted-foreground"
                  >
                    Tidak ada aplikasi pinjaman.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <LendingApplicationForm
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
