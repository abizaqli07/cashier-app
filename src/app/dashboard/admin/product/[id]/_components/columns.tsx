"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";

import { Button } from "~/components/ui/button";

type inventories = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isPlus: boolean | null;
  amount: number;
  productId: string;
};

export const columns: ColumnDef<inventories>[] = [
  {
    accessorKey: "isPlus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Plus/Minus
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-semibold">
          {row.original.isPlus ? "Plus" : "Minus"}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div
          className={`flex items-center gap-2 text-lg font-semibold ${row.original.isPlus ? "text-green-400" : "text-red-500"}`}
        >
          {row.original.isPlus ? "+" : "-"} {row.original.amount}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return <div>{format(row.original.createdAt, "dd MMMM yyyy")}</div>;
    },
  },
];
