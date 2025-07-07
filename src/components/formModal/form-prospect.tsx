"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // pastikan kamu ekspor komponen ini
import { Prospect } from "@/types/prospect";
import { useGetTaskSchedulesQuery } from "@/services/coordinator/taskactivity.service";

interface ProspectFormProps {
  form: Partial<Prospect>;
  setForm: (form: Partial<Prospect>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function ProspectForm({
  form,
  setForm,
  onCancel,
  onSubmit,
}: ProspectFormProps) {
  const isEdit = !!form.id;

  const { data: taskScheduleData = { data: [] }, isLoading } =
    useGetTaskSchedulesQuery({ page: 1, paginate: 1000 });

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Prospek" : "Tambah Prospek"}
        </h2>
        <Button variant="ghost" onClick={onCancel} aria-label="Tutup">
          ✕
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-y-1">
          <Label>Task Schedule</Label>
          <select
            value={form.task_schedule_id ?? ""}
            onChange={(e) => {
              const selectedTask = taskScheduleData.data.find(
                (t) => t.id === Number(e.target.value)
              );

              setForm({
                ...form,
                task_schedule_id: Number(e.target.value),
                assignment_id: selectedTask?.assignment_id ?? 0,
              });
            }}
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            disabled={isLoading}
          >
            <option value="">Pilih Task Schedule</option>
            {taskScheduleData.data.map((task) => (
              <option key={task.id} value={task.id}>
                {`[${task.id}] ${task.customer_first_name} ${
                  task.customer_last_name
                } - ${new Date(task.scheduled_at).toLocaleString("id-ID")}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Product Type</Label>
          <Select
            value={form.product_type ?? ""}
            onValueChange={(value) => {
              const defaultProductId =
                value === "App\\Models\\Product\\FundingProduct" ? 1 : 2;

              setForm({
                ...form,
                product_type: value,
                product_id: defaultProductId,
              });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih jenis produk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="App\Models\Product\FundingProduct">
                Funding Product
              </SelectItem>
              <SelectItem value="App\Models\Product\LendingProduct">
                Lending Product
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Product ID</Label>
          <Input
            type="number"
            value={form.product_id ?? ""}
            disabled
            placeholder="Product ID akan terisi otomatis"
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Deskripsi</Label>
          <Textarea
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Masukkan catatan atau komentar"
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Status</Label>
          <Select
            value={form.status?.toString() ?? ""}
            onValueChange={(value) =>
              setForm({ ...form, status: parseInt(value) })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih status prospek" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Pending</SelectItem>
              <SelectItem value="1">Visited</SelectItem>
              <SelectItem value="2">Waiting for Response</SelectItem>
              <SelectItem value="3">Accepted</SelectItem>
              <SelectItem value="4">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={onSubmit}>{isEdit ? "Perbarui" : "Simpan"}</Button>
      </div>
    </div>
  );
}
