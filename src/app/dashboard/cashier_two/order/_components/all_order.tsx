"use client";

import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import CreateOrder from "./create_order";
import ServiceCard from "./service_card";
import { parseAsInteger, useQueryState } from "nuqs";
import { DEFAULT_PAGE, DEFAULT_TOTAL_ITEMS } from "~/lib/default_params";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

const AllOrder = () => {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(DEFAULT_PAGE),
  );
  const { data, isLoading, isError } =
    api.employeeRoute.order.getUncomplete.useQuery({
      page: page < 1 ? DEFAULT_PAGE : page,
      totalItems: DEFAULT_TOTAL_ITEMS,
      search,
    });

  if (isLoading) {
    return (
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between py-4">
          <Input
            className="mr-2 max-w-sm"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value || null)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-full w-40" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || data === undefined) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center rounded-lg border-2 border-dotted p-6 px-24 text-center">
        <div className="text-2xl font-semibold">
          Something wrong on the server
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Find order..."
          className="mr-2 max-w-sm"
          value={search}
          onChange={(event) => setSearch(event.target.value || null)}
        />

        <CreateOrder />
      </div>

      <div className="mx-auto flex w-full flex-col justify-center gap-10 py-10">
        {data.orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.orders.map((order) => (
              <ServiceCard key={order.id} service={order} />
            ))}
          </div>
        ) : (
          <div className="flex h-[200px] w-full items-center justify-center rounded-lg border-2 border-dotted px-24 py-4 text-center">
            <div className="text-2xl font-semibold">No Product</div>
          </div>
        )}
      </div>

      <Pagination>
        <PaginationContent>
          {page !== 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage((old) => old - 1)} />
            </PaginationItem>
          )}

          {Array.from({ length: data.totalPages ?? 1 }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink onClick={() => setPage(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {page !== data.totalPages + 1 && (
            <PaginationItem>
              <PaginationNext onClick={() => setPage((old) => old + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AllOrder;
