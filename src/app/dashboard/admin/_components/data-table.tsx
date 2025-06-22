"use client";

import {
  IconBuildingStore,
  IconCash,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader,
  IconQrcode,
  IconReceiptDollar,
  IconShoe,
  IconUserDollar,
} from "@tabler/icons-react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, CalendarIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { CSVLink } from "react-csv";
import type { DateRange } from "react-day-picker";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { currencyFormatter } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";

export const columns: ColumnDef<
  RouterOutputs["dashboard"]["getOverview"][number]
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
    accessorKey: "userId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Employee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          <IconUserDollar className="size-4" />
          {row.original.user?.name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "serviceId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Store
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.serviceId !== null ? (
            <>
              <IconShoe className="size-4 text-sky-500 dark:text-sky-400" />
              Store 2 (Service)
            </>
          ) : (
            <>
              <IconBuildingStore className="size-4 text-green-500 dark:text-green-400" />
              Store 1 (Product)
            </>
          )}
        </Badge>
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
                href={`/dashboard/admin/transaction/${id}`}
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

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  // Date picker Components
  const monthsAgo = new Date();
  monthsAgo.setMonth(monthsAgo.getMonth() - 1);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: monthsAgo,
    to: new Date(),
  });
  const [data] = api.dashboard.getOverview.useSuspenseQuery();

  // React-CSV Functionality
  const filteredTransaction = data
    .filter((tx) => {
      return (
        tx.createdAt >= (dateRange?.from ?? monthsAgo) &&
        tx.createdAt <= (dateRange?.to ?? new Date())
      );
    })
    .map((arr) => ({
      id: arr.invoiceId,
      customer: arr.name,
      description: arr.description,
      totalProduct: arr.countProduct !== 0 ? arr.countProduct : 1,
      totalPrice: arr.totalPrice,
      employee: arr.user?.name,
      employeePhone: arr.user?.phone ?? "Doest have phone number",
      store: arr.serviceId ? "Store 2" : "Store 1",
      status: arr.status,
      paymentStatus: arr.payment,
      paymentMethod: arr.method,
      date: arr.createdAt,
    }));

  const headers = [
    { label: "ID", key: "id" },
    { label: "Customer Name", key: "customer" },
    { label: "Order Description", key: "description" },
    { label: "Total Product Order", key: "totalProduct" },
    { label: "Total Price", key: "totalPrice" },
    { label: "Employee Name", key: "employee" },
    { label: "Employee Phone", key: "employeePhone" },
    { label: "Store", key: "store" },
    { label: "Order Status", key: "status" },
    { label: "Payment Status", key: "paymentStatus" },
    { label: "Payment Method", key: "paymentMethod" },
    { label: "Date", key: "date" },
  ];

  // Data Table Functionality
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="px-4 lg:px-6">
      <div className="flex flex-col items-start justify-between gap-y-4 py-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Filter transaction..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="mr-2 max-w-sm"
        />
        <div className="flex items-center gap-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon />
                {dateRange ? (
                  <span>
                    {format(dateRange?.from ?? monthsAgo, "PPP")} to{" "}
                    {format(dateRange?.to ?? new Date(), "PPP")}
                  </span>
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="rounded-lg border shadow-sm"
              />
            </PopoverContent>
          </Popover>
          <Button disabled={dateRange === undefined} variant={"outline"}>
            <CSVLink
              data={filteredTransaction}
              headers={headers}
              filename={`transaction_${dateRange?.from?.toLocaleDateString()}_to_${dateRange?.to?.toLocaleDateString()}.csv`}
            >
              Download
            </CSVLink>
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
