"use client";

import { IconShoppingCart } from "@tabler/icons-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { DEFAULT_PAGE, DEFAULT_TOTAL_ITEMS } from "~/lib/default_params";
import { api } from "~/trpc/react";
import AllProduct from "./_components/all_product";

const OrderPage = () => {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(DEFAULT_PAGE),
  );

  const { data, isLoading, isError } =
    api.employeeRoute.product.getAll.useQuery({
      page: page < 1 ? DEFAULT_PAGE : page,
      totalItems: DEFAULT_TOTAL_ITEMS,
      search,
    });
  const {
    data: categories,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = api.employeeRoute.category.getAll.useQuery();

  const handleSearch = (data: string | null) => {
    void setSearch(data);
  };

  const handleNextPage = () => {
    void setPage((old) => old + 1);
  };
  const handlePreviousPage = () => {
    void setPage((old) => old - 1);
  };

  const handleNumberPage = (data: number) => {
    void setPage(data + 1);
  };

  if (isLoading || isCategoryLoading) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between py-4">
              <Input
                className="mr-2 max-w-sm"
                placeholder="Search"
                value={search}
                onChange={(event) => setSearch(event.target.value || null)}
              />
              <Button size={"lg"} className=" relative">
                <span className="absolute -top-2 -left-2 size-6 rounded-full bg-red-400 p-1 text-center text-xs text-white">
                  0
                </span>
                <IconShoppingCart className="mr-2 size-6" />
                Cart
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-96 w-full" />
              ))}
            </div>
          </div>
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
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <AllProduct
          categories={categories}
          data={data.products}
          handleSearch={handleSearch}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          handleNumberPage={handleNumberPage}
          valuePage={page}
          valueSearch={search}
          totalPages={data.totalPages}
        />
      </div>
    </div>
  );
};

export default OrderPage;
