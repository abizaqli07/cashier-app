"use client";

import { IconShoppingCart } from "@tabler/icons-react";
import { useEffect, useState } from "react";
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

export default function CartOrder() {
  // Initial products for the demo
  const initialProducts: CartProduct[] = [
    {
      id: "prod-1",
      imageUrl: "/images/placeholder_product.webp",
      name: "Wireless Headphones",
      price: 98.96,
      quantity: 1,
    },
    {
      id: "prod-2",
      imageUrl: "/images/placeholder_product.webp",
      name: "Smart Watch",
      price: 129.99,
      quantity: 2,
    },
    {
      id: "prod-3",
      imageUrl: "/images/placeholder_product.webp",
      name: "Bluetooth Speaker",
      price: 79.95,
      quantity: 1,
    },
  ];

  // State management
  const [products, setProducts] = useState<CartProduct[]>(initialProducts);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [shippingCost] = useState<number>(0);
  const [vatRate] = useState<number>(0);
  const [isLoading] = useState<boolean>(false);
  const [errorMessage] = useState<string>("");

  // Calculate subtotal whenever the products change
  useEffect(() => {
    const newSubtotal = products.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );
    setSubtotal(newSubtotal);
  }, [products]);

  // Handler to update product quantity
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setProducts(
      products.map((product) =>
        product.id === productId
          ? { ...product, quantity: newQuantity }
          : product,
      ),
    );
  };

  // Handler to remove a product
  const handleRemoveProduct = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  // Handler for checkout
  const handleCheckout = (payload: CartCheckoutPayload) => {
    const itemCount = payload.products.reduce((sum, p) => sum + p.quantity, 0);
    window.alert(
      `Proceeding to checkout with ${itemCount} items.\nTotal: ${payload.currencyPrefix}${payload.totalAmount.toFixed(2)}
      `,
    );
  };

  // Handler for continue shopping
  const handleContinueShopping = (payload: CartCheckoutPayload) => {
    if (payload.products.length === 0) {
      window.alert("Starting your shopping journey!");
    } else {
      const itemCount = payload.products.reduce(
        (sum, p) => sum + p.quantity,
        0,
      );
      window.alert(
        `Continuing shopping with ${itemCount} items in your cart.\nSubtotal: ${payload.currencyPrefix}${payload.subtotal.toFixed(2)}
        `,
      );
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button size={"lg"}>
            <IconShoppingCart className="mr-2 size-6" />
            Cart
          </Button>
        </DialogTrigger>
        <DialogContent className="scrollbar-hide max-h-[90vh] w-[90%] overflow-auto border-transparent bg-transparent sm:max-w-3xl p-0">
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
            isLoading={isLoading}
            errorMessage={errorMessage}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveProduct={handleRemoveProduct}
            onCheckout={handleCheckout}
            onContinueShopping={handleContinueShopping}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
