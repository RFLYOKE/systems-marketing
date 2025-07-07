"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import useModal from "@/hooks/use-modal";
import FundingApplicationForm, {
  FundingApplication,
} from "@/components/formModal/funding-app-form";

export default function FundingApplicationPage() {
  const [applications, setApplications] = useState<FundingApplication[]>([]);
  const [form, setForm] = useState<Partial<FundingApplication>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const { isOpen, openModal, closeModal } = useModal();

  const handleSubmit = () => {
    if (editingId !== null) {
      setApplications(
        applications.map((a) =>
          a.id === editingId ? ({ ...a, ...form } as FundingApplication) : a
        )
      );
    } else {
      const newApp = {
        id: Date.now(),
        customerName: form.customerName || "",
        product: form.product || "",
        amount: Number(form.amount) || 0,
        date: new Date().toISOString().slice(0, 10),
        status:
          (form.status as "Tertunda" | "Disetujui" | "Ditolak") || "Tertunda",
        sales: form.sales || "",
        coordinator: form.coordinator || "",
      };
      setApplications([newApp, ...applications]);
    }
    setForm({});
    setEditingId(null);
    closeModal();
  };

  const handleEdit = (app: FundingApplication) => {
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
      filterStatus === "semua" || filterStatus === a.status.toLowerCase();
    return match && statusMatch;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Data Marketing</h1>

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
            <option value="disetujui">Disetujui</option>
            <option value="ditolak">Ditolak</option>
          </select>
          <Button
            onClick={() => {
              setForm({});
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
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Whatsapp</th>
                <th className="px-4 py-2">Pendidikan</th>
                <th className="px-4 py-2">Alamat</th>
                <th className="px-4 py-2">Jenis Kelamin</th>
                <th className="px-4 py-2">Tanggal Lahir</th>
                <th className="px-4 py-2">Kampus</th>
                <th className="px-4 py-2">CV</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2">{a.customerName}</td>
                  <td className="px-4 py-2">{a.product}</td>
                  <td className="px-4 py-2">Rp {a.amount.toLocaleString()}</td>
                  <td className="px-4 py-2">{a.date}</td>
                  <td className="px-4 py-2">{a.sales}</td>
                  <td className="px-4 py-2">{a.coordinator}</td>
                  <td className="px-4 py-2">
                    <Badge
                      variant={
                        a.status === "Disetujui"
                          ? "success"
                          : a.status === "Ditolak"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {a.status}
                    </Badge>
                  </td>
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
                    Tidak ada aplikasi pendanaan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <FundingApplicationForm
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
