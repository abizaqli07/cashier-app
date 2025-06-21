"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";

import { Button } from "~/components/ui/button";
import { formatTime } from "~/lib/utils";

interface ClockingInterface {
  date: Date;
  id: string;
  userId: string;
  start: Date;
  end: Date | null;
  totalHour: number | null;
}

export const columns: ColumnDef<ClockingInterface>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Working Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{format(row.original.date, "dd MMMM yyyy")}</div>;
    },
  },
  {
    accessorKey: "start",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{format(row.original.start, "KK:mm aaa")}</div>;
    },
  },
  {
    accessorKey: "end",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stop Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const times = row.original.end;
      return (
        <div>
          {times !== null ? format(times, "KK:mm aaa") : "Not yet finished"}
        </div>
      );
    },
  },

  {
    accessorKey: "totalHour",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total hour
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{formatTime(row.original.totalHour ?? 0)}</div>;
    },
  },
];
