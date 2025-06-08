"use client";

import { IconLoader, IconUserX } from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "~/components/ui/badge";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type RouterOutputs } from "~/trpc/react";
import UpdateButton from "./update_button";
import ChangePassword from "./change_password";
import DeleteButton from "./delete_button";

export const columns: ColumnDef<
  RouterOutputs["adminRoute"]["employee"]["getAll"][number]
>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Employment Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      let status = "";

      if (row.original.status === "EMPLOYED") {
        status = "Employed";
      } else if (row.original.status === "PENDING") {
        status = "Pending";
      } else {
        status = "Resign";
      }

      return (
        <div className="w-32">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "clocking",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Clocking
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      let clockingStatus;
      if (row.original.clockings.length !== 0) {
        clockingStatus = true;
      } else {
        clockingStatus = false;
      }

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {clockingStatus ? (
            <>
              <IconLoader className="fill-green-500 dark:fill-green-400" />
              Active
            </>
          ) : (
            <>
              <IconUserX />
              Inactive
            </>
          )}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      // const { id } = row.original;
      // const name: string = row.getValue("name");

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Employee Actions</DropdownMenuLabel>
              <UpdateButton data={row.original} />
              <ChangePassword employeeId={row.original.id} />
              <DeleteButton employeeId={row.original.id} />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
