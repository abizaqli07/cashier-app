"use client";

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
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { format } from "date-fns";
import { ArrowUpDown, CalendarIcon } from "lucide-react";
import { CSVLink } from "react-csv";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
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

export function DataTable({ data }: { data: ClockingInterface[] }) {
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

  // React-CSV Functionality
  const filteredClocking = data
    .filter((tx) => {
      return (
        tx.date >= (dateRange?.from ?? monthsAgo) &&
        tx.date <= (dateRange?.to ?? new Date())
      );
    })
    .map((arr) => ({
      id: arr.id,
      start: arr.start,
      end: arr.end,
      date: arr.date,
      totalHour: formatTime(arr.totalHour ?? 0),
    }));

  const allData = data.map((arr) => ({
    id: arr.id,
    start: arr.start,
    end: arr.end,
    date: arr.date,
    totalHour: formatTime(arr.totalHour ?? 0),
  }));

  const headers = [
    { label: "ID", key: "id" },
    { label: "Clocking Date", key: "date" },
    { label: "Start Time", key: "start" },
    { label: "Stop Time", key: "stop" },
    { label: "Total Hour", key: "totalHour" },
  ];

  // React Table Functionality
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
    <div>
      <div className="flex flex-col items-start justify-between gap-y-4 py-4 sm:flex-row sm:items-center">
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
              data={filteredClocking}
              headers={headers}
              filename={`user_clockings_${dateRange?.from?.toLocaleDateString()}_to_${dateRange?.to?.toLocaleDateString()}.csv`}
            >
              Download
            </CSVLink>
          </Button>
        </div>
        <Button disabled={dateRange === undefined} variant={"outline"}>
          <CSVLink
            data={allData}
            headers={headers}
            filename={`user_clockings_allData.csv`}
          >
            Download All
          </CSVLink>
        </Button>
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
