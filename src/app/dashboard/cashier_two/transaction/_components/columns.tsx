"use client";

import {
  IconCash,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader,
  IconQrcode,
  IconReceiptDollar,
} from "@tabler/icons-react";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { currencyFormatter } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";

export const columns: ColumnDef<
  RouterOutputs["employeeRoute"]["order"]["getAll"][number]
>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer Name
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
          Order Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.status === "SUCCESS" && (
            <>
              <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
              Complete
            </>
          )}
          {row.original.status === "PROCESS" && (
            <>
              <IconLoader />
              On Process
            </>
          )}
          {row.original.status === "PENDING" && (
            <>
              <IconLoader />
              Pending
            </>
          )}
          {row.original.status === "FAILED" && (
            <>
              <IconCircleXFilled className="fill-rose-500 dark:fill-rose-400" />
              Failed
            </>
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "method",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment Method
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.method === "Qris" ? (
            <>
              <IconQrcode className="size-4 text-sky-500 dark:text-sky-400" />
              Qris
            </>
          ) : (
            <>
              <IconCash className="size-4 text-green-500 dark:text-green-400" />
              Cash
            </>
          )}
        </Badge>
      );
    },
  },
  {
    id: "payment",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      let storeType;
      if (row.original.payment === "PAID") {
        storeType = "Paid";
      } else if (row.original.payment === "PENDING") {
        storeType = "Pending";
      } else {
        storeType = "Failed";
      }

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.payment === "PAID" ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconLoader
              className={`${row.original.payment === "FAILED" ? "fill-rose-500 dark:fill-rose-400" : ""}`}
            />
          )}
          {storeType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formattedPrice = currencyFormatter.format(
        Number(row.original.totalPrice),
      );

      return <div>{formattedPrice}</div>;
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
      return <div>{format(row.original.createdAt, "dd MMMM yyyy")}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { id } = row.original;

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
              <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
              <Link
                className="hover:bg-accent relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none"
                href={`/dashboard/cashier_two/transaction/${id}`}
              >
                <IconReceiptDollar className="mr-2 h-4 w-4" />
                Invoice
              </Link>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
