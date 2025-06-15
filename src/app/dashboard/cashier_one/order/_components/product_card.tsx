"use client";

import { IconCirclePlusFilled } from "@tabler/icons-react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { CartProduct } from "~/components/ui/cart";
import { currencyFormatter } from "~/lib/utils";
import type { RouterOutputs } from "~/trpc/react";

interface ProductCardProps {
  product: RouterOutputs["employeeRoute"]["product"]["getAll"]["products"][number];
  handleAddProduct: (data: CartProduct) => void;
}

const ProductCard = ({ product, handleAddProduct }: ProductCardProps) => {
  const available = product.quantity !== 0;

  return (
    <Card key={product.id} className="flex flex-col justify-between p-2">
      <CardHeader className="relative p-0">
        <div className="relative aspect-square w-full">
          <Image
            src={product.image ?? "/images/placeholder_product.webp"}
            alt={product.name}
            fill
            loading="lazy"
            className="rounded-t-lg object-cover"
          />
        </div>
        <Badge className="absolute top-2 left-2">
          {product.category?.name}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <CardTitle>{product.name}</CardTitle>
        </div>
        <p className="text-lg font-semibold">
          {currencyFormatter.format(Number(product.price))}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between pb-4">
        <div className={`font-light ${available ? "" : "text-red-400"}`}>
          {available ? "Product available" : "*Out of stock"}
        </div>
        <div className="space-x-2">
          <Button
            size={"icon"}
            disabled={!available}
            onClick={() =>
              handleAddProduct({
                id: product.id,
                imageUrl: product.image ?? "/images/placeholder_product.webp",
                name: product.name,
                price: parseInt(product.price),
                quantity: 1,
              })
            }
          >
            <IconCirclePlusFilled className="size-8" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
