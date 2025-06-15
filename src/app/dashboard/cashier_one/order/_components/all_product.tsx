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
import { type RouterOutputs } from "~/trpc/react";

import ProductCard from "./product_card";

import { IconShoppingCart } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
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

interface AllProductInterface {
  data: RouterOutputs["employeeRoute"]["product"]["getAll"]["products"];
  categories: RouterOutputs["employeeRoute"]["category"]["getAll"];
  handleSearch: (data: string | null) => void;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  handleNumberPage: (data: number) => void;
  valueSearch: string;
  valuePage: number;
  totalPages: number;
}

const AllProduct = ({
  data,
  categories,
  handleSearch,
  handleNextPage,
  handlePreviousPage,
  handleNumberPage,
  valueSearch,
  valuePage,
  totalPages,
}: AllProductInterface) => {
  const [products, setProducts] = useState<CartProduct[]>();
  const [subtotal, setSubtotal] = useState<number>(0);
  const [shippingCost] = useState<number>(0);
  const [vatRate] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate subtotal whenever the products change
  useEffect(() => {
    const newSubtotal = products?.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );
    setSubtotal(newSubtotal ?? 0);
  }, [products]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      setProducts([...products, data]);
    }
  };

  // Handler for checkout
  const handleCheckout = (payload: CartCheckoutPayload) => {
    const itemCount = payload.products.reduce((sum, p) => sum + p.quantity, 0);
    window.alert(
      `Proceeding to checkout with ${itemCount} items.\nTotal: ${payload.currencyPrefix}${payload.totalAmount.toFixed(2)}
        `,
    );
  };

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-between py-4">
        <Input
          ref={inputRef}
          className="mr-2 max-w-sm"
          placeholder="Search"
          value={valueSearch}
          onChange={(event) => handleSearch(event.target.value || null)}
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
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mx-auto flex w-full flex-col justify-center gap-10 py-10">
        {data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {data.map((product) => (
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
          {valuePage !== 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePreviousPage()} />
            </PaginationItem>
          )}

          {Array.from({ length: totalPages ?? 1 }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink onClick={() => handleNumberPage(index)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {valuePage !== totalPages + 1 && (
            <PaginationItem>
              <PaginationNext onClick={() => handleNextPage()} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AllProduct;
