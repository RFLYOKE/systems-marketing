"use client";

import summary from "@/json/summary.json";
import { Card } from "@/components/ui/card";
import { ChartBar } from "lucide-react";

export function SummaryCards() {
  const { usersCount, productsCount, applications } = summary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Kartu pengguna */}
      <Card className="p-4 flex items-center">
        <ChartBar className="h-6 w-6 text-blue-500" />
        <div className="ml-4">
          <p className="text-sm text-muted-foreground">Total Pengguna</p>
          <p className="text-2xl font-semibold">{usersCount}</p>
        </div>
      </Card>

      {/* Kartu produk */}
      <Card className="p-4 flex items-center">
        <ChartBar className="h-6 w-6 text-green-500" />
        <div className="ml-4">
          <p className="text-sm text-muted-foreground">Produk Aktif</p>
          <p className="text-2xl font-semibold">{productsCount}</p>
        </div>
      </Card>

      {/* Kartu aplikasi pending */}
      <Card className="p-4 flex items-center">
        <ChartBar className="h-6 w-6 text-purple-500" />
        <div className="ml-4">
          <p className="text-sm text-muted-foreground">Aplikasi Pending</p>
          <p className="text-2xl font-semibold">{applications.pending}</p>
        </div>
      </Card>

      {/* Kartu aplikasi approved */}
      <Card className="p-4 flex items-center">
        <ChartBar className="h-6 w-6 text-emerald-500" />
        <div className="ml-4">
          <p className="text-sm text-muted-foreground">Aplikasi Approved</p>
          <p className="text-2xl font-semibold">{applications.approved}</p>
        </div>
      </Card>

      {/* Kartu aplikasi rejected */}
      <Card className="p-4 flex items-center">
        <ChartBar className="h-6 w-6 text-red-500" />
        <div className="ml-4">
          <p className="text-sm text-muted-foreground">Aplikasi Rejected</p>
          <p className="text-2xl font-semibold">{applications.rejected}</p>
        </div>
      </Card>
    </div>
  );
}
