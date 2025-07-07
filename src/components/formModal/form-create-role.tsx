"use client";
import React from "react";
import { FormCreateRoleProps } from "@/types/user";

export default function FormCreateRole({
  onClose,
  onSubmit,
  initialData,
  roleName,
  setRoleName,
  isSubmitting,
}: FormCreateRoleProps) {
  return (
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Peran" : "Tambah Peran Baru"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="roleName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nama Peran
            </label>
            <input
              type="text"
              id="roleName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-neutral-700 rounded-md hover:bg-gray-300 dark:hover:bg-neutral-600 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md shadow hover:bg-primary/90 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
  );
}
