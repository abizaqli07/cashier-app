"use client";

import { IconPencil } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { currencyFormatter } from "~/lib/utils";
import type { RouterOutputs } from "~/trpc/react";
import DeleteButton from "./delete_button";

interface ProductCardProps {
  product: RouterOutputs["adminRoute"]["product"]["getAll"]["products"][number];
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card key={product.id} className="flex flex-col justify-between p-2">
      <CardHeader className="relative p-0">
        <div className="relative aspect-square w-full">
          <Image
            src={product.image ?? ""}
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
        <div className="font-semibold">{product.quantity ?? 0}</div>
        <div className="space-x-2">
          <Link href={`/dashboard/admin/product/${product.id}`}>
            <Button variant={"outline"}>
              <IconPencil className="text- size-4" />
            </Button>
          </Link>
          <DeleteButton productId={product.id} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
