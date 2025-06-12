"use client";

import { Input } from "~/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { Skeleton } from "~/components/ui/skeleton";
import { DEFAULT_PAGE, DEFAULT_TOTAL_ITEMS } from "~/lib/default_params";
import { api } from "~/trpc/react";
import CreateButton from "./create_button";
import ProductCard from "./product_card";

import { parseAsInteger, useQueryState } from "nuqs";

const AllProduct = () => {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(DEFAULT_PAGE),
  );

  const { data, isLoading, isError } = api.adminRoute.product.getAll.useQuery({
    page: page < 1 ? DEFAULT_PAGE : page,
    totalItems: DEFAULT_TOTAL_ITEMS,
    search,
  });
  const {
    data: categories,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = api.adminRoute.category.getAll.useQuery();

  if (isLoading || isCategoryLoading) {
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
            <Skeleton key={index} className="h-96 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (
    isError ||
    data === undefined ||
    isCategoryError ||
    categories === undefined
  ) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center rounded-lg border-2 border-dotted px-24 py-4 text-center">
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
          className="mr-2 max-w-sm"
          placeholder="Search"
          value={search}
          onChange={(event) => setSearch(event.target.value || null)}
        />

        <CreateButton categories={categories} />
      </div>

      <div className="mx-auto flex w-full flex-col justify-center gap-10 py-10">
        {data.products.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
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

export default AllProduct;
