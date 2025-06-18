/* eslint-disable @typescript-eslint/no-empty-function */
"use client";

import { Loader2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import QuantityInputBasic from "~/components/ui/quantity-input";
import { Input } from "./input";
import { Label } from "./label";
import PriceFormat from "./price-format";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

// Default logo placeholder
const DEFAULT_LOGO = "/logo.webp";

// Product item interface
interface CartProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// Cart checkout payload interface
interface CartCheckoutPayload {
  products: CartProduct[];
  customer: string;
  method: string;
  subtotal: number;
  shippingCost: number;
  vatAmount: number;
  vatRate: number;
  totalAmount: number;
  currencyPrefix: string;
}

// Cart component props
interface CartProps {
  storeName?: string;
  logoUrl?: string;
  products?: CartProduct[];
  subtotal?: number;
  shippingCost?: number;
  vatRate?: number;
  currencyPrefix?: string;
  isLoading?: boolean;
  errorMessage?: string;
  customer?: string;
  method?: string;
  onCheckout?: (payload: CartCheckoutPayload) => void;
  onContinueShopping?: (payload: CartCheckoutPayload) => void;
  onUpdateQuantity?: (productId: string, newQuantity: number) => void;
  onRemoveProduct?: (productId: string) => void;
  onCustomerChange?: (name: string) => void;
  onMethodChange?: (method: string) => void;
}

function Cart({
  currencyPrefix = "Rp ",
  errorMessage = "",
  isLoading = false,
  logoUrl = DEFAULT_LOGO,
  onCheckout = () => {},
  onContinueShopping = () => {},
  onRemoveProduct = () => {},
  onUpdateQuantity = () => {},
  onCustomerChange = () => {},
  onMethodChange = () => {},
  products,
  method = "Cash",
  customer = "",
  shippingCost = 0,
  storeName = "TechGadgets",
  subtotal = 0,
  vatRate = 0, // 20% VAT
}: CartProps = {}) {
  // Calculate VAT and total
  const vatAmount = subtotal * vatRate;
  const totalAmount = subtotal + shippingCost + vatAmount;

  const isCartEmpty = !products || products.length === 0;

  // Create the checkout payload
  const checkoutPayload: CartCheckoutPayload = {
    currencyPrefix,
    products: [...(products ?? [])],
    shippingCost,
    subtotal,
    totalAmount,
    vatAmount,
    vatRate,
    customer,
    method,
  };

  return (
    <div className="bg-background scrollbar-hide w-full max-w-4xl rounded-xl border border-gray-200 shadow-sm">
      {/* Store Header */}
      <div className="bg-primary flex items-center space-x-4 rounded-t-xl p-6 text-white">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-white p-1">
          <div className="relative h-full w-full">
            <Image
              src={logoUrl}
              alt={`${storeName} logo`}
              width={48}
              height={48}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold">{storeName}</h1>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="m-6 rounded-md bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Loading your cart...
          </p>
        </div>
      )}

      {!isLoading && !errorMessage && !isCartEmpty && (
        <div className="bg-gray-50 p-6 dark:bg-gray-800/50">
          <div className="w-full space-y-2 sm:max-w-sm">
            <Label htmlFor="customer">Customer Name</Label>
            <Input
              type="text"
              id="customer"
              placeholder="Name"
              onChange={(event) => onCustomerChange(event.target.value)}
            />
            {customer.length < 1 && (
              <p className="text-destructive text-sm">*required</p>
            )}
          </div>

          <div className="mt-6 space-y-2">
            <Label>Payment Method</Label>
            <Select
              onValueChange={(value) => onMethodChange(value)}
              defaultValue={method}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Method</SelectLabel>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Qris">Qris</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Cart Items or Empty Cart Message */}
      {!isLoading &&
        !errorMessage &&
        (isCartEmpty ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
              <ShoppingCart
                size={48}
                className="text-gray-400 dark:text-gray-500"
              />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Your order cart is empty
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Button
              onClick={() => onContinueShopping(checkoutPayload)}
              className="bg-primary hover:bg-primary/80 text-white transition-all"
            >
              Start Add Product
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[80px_1fr_auto_auto_auto] items-center gap-4 p-6"
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                  <div className="relative h-full w-full">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-contain"
                      width={80}
                      height={80}
                    />
                  </div>
                </div>

                <div className="max-w-[200px] overflow-hidden">
                  <h3 className="overflow-hidden text-lg font-medium text-ellipsis whitespace-nowrap text-gray-900 dark:text-gray-100">
                    {product.name}
                  </h3>
                  <PriceFormat
                    prefix={currencyPrefix}
                    value={product.price}
                    className="mt-1 text-gray-600 dark:text-gray-400"
                  />
                </div>

                <div className="flex items-center">
                  <QuantityInputBasic
                    quantity={product.quantity}
                    min={1}
                    onChange={(newQuantity) =>
                      onUpdateQuantity(product.id, newQuantity)
                    }
                    className="border-gray-300 dark:border-gray-700"
                  />
                </div>

                <div className="w-24 text-right">
                  <PriceFormat
                    prefix={currencyPrefix}
                    value={product.price * product.quantity}
                    className="font-medium text-gray-900 dark:text-gray-100"
                  />
                </div>

                <button
                  onClick={() => onRemoveProduct(product.id)}
                  className="justify-self-end text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Remove item"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ))}

      {/* Summary Section - Only show if cart has items and not loading/error */}
      {!isLoading && !errorMessage && !isCartEmpty && (
        <div className="bg-gray-50 p-6 dark:bg-gray-800/50">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
            Order Summary
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <PriceFormat prefix={currencyPrefix} value={subtotal} />
            </div>

            {shippingCost !== 0 && (
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <PriceFormat prefix={currencyPrefix} value={shippingCost} />
              </div>
            )}

            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>VAT ({(vatRate * 100).toFixed(0)}%)</span>
              <PriceFormat prefix={currencyPrefix} value={vatAmount} />
            </div>

            <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
              <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100">
                <span>Total</span>
                <PriceFormat
                  prefix={currencyPrefix}
                  value={totalAmount}
                  className="text-primary text-xl"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              onClick={() => onCheckout(checkoutPayload)}
              className="bg-primary hover:bg-primary/80 w-full text-white transition-all"
              disabled={isLoading || customer.length < 1}
            >
              Proceed to Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
export type { CartCheckoutPayload, CartProduct, CartProps };

