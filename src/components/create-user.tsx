"use client";
import { useEffect, useState } from "react";
import {
  useDeleteUserMutation,
  useGetRolesQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from "@/services/users.service";
import FormCreateUser from "@/components/formModal/form-create-user";
import useModal from "@/hooks/use-modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { User } from "@/types/user";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Swal from "sweetalert2";

export default function CreateUser() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchBy] = useState("name");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [usersPerPage] = useState(10);

  const {
    data: result,
    isLoading,
    isError,
    refetch,
  } = useGetUsersQuery({
    page: currentPage,
    paginate: usersPerPage,
    search,
    search_by: searchBy,
  });

  const { data: roles = [] } = useGetRolesQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const { isOpen, openModal, closeModal } = useModal();

  const users: User[] = result?.data?.data || [];
  const totalPages = result?.data?.last_page || 1;

  const handleAddUser = () => {
    setEditingUser(undefined); // reset
    openModal();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    openModal();
  };

  const handleDelete = async (user: User) => {
    const result = await Swal.fire({
      title: `Hapus ${user.name}?`,
      text: "Apakah Anda yakin ingin menghapus user ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(user.id).unwrap();
        Swal.fire("Berhasil!", "User berhasil dihapus.", "success");
        refetch();
      } catch (err) {
        console.error("Gagal menghapus:", err);
        Swal.fire("Error", "Terjadi kesalahan saat menghapus user.", "error");
      }
    }
  };  

  const toggleStatus = async (user: User) => {
    const action = user.status ? "Nonaktifkan" : "Aktifkan";

    const result = await Swal.fire({
      title: `${action} ${user.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: action,
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const payload = {
          role_id: user.roles?.[0]?.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status ? 0 : 1,
        };
        await updateUserStatus({ id: user.id, payload }).unwrap();
        Swal.fire(
          "Berhasil!",
          `Status user ${user.name} diperbarui.`,
          "success"
        );
        refetch();
      } catch (error) {
        console.error("Gagal ubah status:", error);
        Swal.fire("Error", "Gagal mengubah status user.", "error");
      }
    }
  };  

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <main className="p-6 w-full mx-auto">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Data Pengguna</h2>
            <p className="text-sm text-muted-foreground">
              Kelola semua akun pengguna di sistem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Pencarian nama..."
              className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-sm bg-white dark:bg-neutral-800"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md text-sm bg-white dark:bg-neutral-800"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">Semua Peran</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                </option>
              ))}
            </select>

            <button
              onClick={handleAddUser}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-md shadow hover:bg-primary/90 transition"
            >
              Tambah Akun
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 shadow rounded overflow-auto">
          {isLoading ? (
            <p className="text-center animate-pulse py-6">
              Memuat data pengguna...
            </p>
          ) : isError ? (
            <p className="text-center py-6">Gagal memuat data!</p>
          ) : (
            <>
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-neutral-700">
                  <tr>
                    {"No Nama Email Telepon Peran Status Aksi"
                      .split(" ")
                      .map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300"
                        >
                          {h}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users
                    .filter((u) => {
                      const matchStatus =
                        statusFilter === "" ||
                        (statusFilter === "active" ? u.status : !u.status);

                      const matchRole =
                        roleFilter === "" ||
                        (u.roles?.[0]?.name?.toLowerCase() || "") ===
                          roleFilter.toLowerCase();

                      return matchStatus && matchRole;
                    })
                    .map((u, idx) => (
                      <tr key={u.id}>
                        <td className="px-4 py-2">
                          {(currentPage - 1) * usersPerPage + idx + 1}
                        </td>
                        <td className="px-4 py-2">{u.name}</td>
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2">{u.phone}</td>
                        <td className="px-4 py-2 capitalize">
                          {u.roles?.[0]?.name || "-"}
                        </td>
                        <td className="px-4 py-2">
                          <Badge variant={u.status ? "success" : "destructive"}>
                            {u.status ? "Aktif" : "Tidak Aktif"}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 flex items-center gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleEdit(u)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(u)}
                          >
                            Delete
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700">
                                <IconDotsVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {u.status ? (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => toggleStatus(u)}
                                >
                                  Nonaktifkan
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => toggleStatus(u)}
                                >
                                  Aktifkan
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center p-4 bg-neutral-100 dark:bg-neutral-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Halaman {currentPage} dari {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-300 dark:bg-neutral-600 text-black dark:text-white rounded disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-gray-300 dark:bg-neutral-600 text-black dark:text-white rounded disabled:opacity-50"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {isOpen && (
        <FormCreateUser
          onClose={closeModal}
          onSuccess={refetch}
          initialData={editingUser ?? undefined}
        />
      )}
    </main>
  );
}
