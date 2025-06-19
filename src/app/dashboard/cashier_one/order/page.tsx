"use client";

import { IconShoppingCart } from "@tabler/icons-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import Cart, {
  type CartCheckoutPayload,
  type CartProduct,
} from "~/components/ui/cart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
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
import ProductCard from "./_components/product_card";

const OrderStoreOnePage = () => {
  const [products, setProducts] = useState<CartProduct[]>();
  const [customer, setCustomer] = useState<string>("");
  const [method, setMethod] = useState<string>("Cash");
  const [subtotal, setSubtotal] = useState<number>(0);
  const [shippingCost] = useState<number>(0);
  const [vatRate] = useState<number>(0);
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(DEFAULT_PAGE),
  );

  // tRPC query and mutation
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
  const createOrder = api.employeeRoute.order.orderProduct.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Success ordering product",
      });
      setProducts(undefined)
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
    },
  });

  // Calculate subtotal whenever the products change
  useEffect(() => {
    const newSubtotal = products?.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );
    setSubtotal(newSubtotal ?? 0);
  }, [products]);

  // Handler to update product quantity
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setProducts(
      products?.map((product) =>
        product.id === productId
          ? { ...product, quantity: newQuantity }
          : product,
      ),
    );
  };

  // Handler to remove a product
  const handleRemoveProduct = (productId: string) => {
    setProducts(products?.filter((product) => product.id !== productId));
  };

  // Handler to add a product
  const handleAddProduct = (data: CartProduct) => {
    if (products === undefined) {
      setProducts([data]);
    } else {
      const alreadyAdd = products?.filter((obj) => obj.id === data.id);
      if (alreadyAdd.length > 0) {
        const newData = products.map((obj) => {
          if (obj.id === alreadyAdd[0]?.id) {
            return { ...obj, quantity: obj.quantity + 1 };
          }
          return obj;
        });
        setProducts(newData);
      } else {
        setProducts([...products, data]);
      }
    }
  };

  // Handler to change customer name
  const handleChangeCustomer = (name: string) => {
    setCustomer(name);
  };

  // Handler to change customer name
  const handleChangeMethod = (method: string) => {
    setMethod(method);
  };

  // Handler for checkout
  const handleCheckout = (payload: CartCheckoutPayload) => {
    createOrder.mutate({
      method: payload.method,
      name: payload.customer,
      totalPrice: String(payload.totalAmount),
      payment: "PAID",
      status: "SUCCESS",
      products: payload.products,
      serviceId: null,
    });
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
              <Button size={"lg"} className="relative">
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
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between py-4">
            <Input
              className="mr-2 max-w-sm"
              placeholder="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value || null)}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button size={"lg"} className="relative">
                  <span className="absolute -top-2 -left-2 size-6 rounded-full bg-red-400 p-1 text-center text-xs text-white">
                    {products?.length ?? 0}
                  </span>
                  <IconShoppingCart className="mr-2 size-6" />
                  Cart
                </Button>
              </DialogTrigger>
              <DialogContent className="scrollbar-hide max-h-[90vh] w-[90%] overflow-auto border-transparent bg-transparent p-0 sm:max-w-3xl">
                <DialogHeader hidden>
                  <DialogTitle>Product Cart</DialogTitle>
                  <DialogDescription>
                    Order your product for checkout
                  </DialogDescription>
                </DialogHeader>

                {/* Forms Registration */}
                <Cart
                  storeName="Cashier App"
                  logoUrl="/logo.webp"
                  products={products}
                  subtotal={subtotal}
                  shippingCost={shippingCost}
                  vatRate={vatRate}
                  currencyPrefix="Rp "
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveProduct={handleRemoveProduct}
                  onCheckout={handleCheckout}
                  customer={customer}
                  method={method}
                  onCustomerChange={handleChangeCustomer}
                  onMethodChange={handleChangeMethod}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="mx-auto flex w-full flex-col justify-center gap-10 py-10">
            {data.products.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {data.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    handleAddProduct={handleAddProduct}
                  />
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
                  <PaginationPrevious onClick={() => setPage(page - 1)} />
                </PaginationItem>
              )}

              {Array.from({ length: data.totalPages ?? 1 }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink onClick={() => setPage(index + 1)}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {page !== data.totalPages && (
                <PaginationItem>
                  <PaginationNext onClick={() => setPage(page + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default OrderStoreOnePage;
