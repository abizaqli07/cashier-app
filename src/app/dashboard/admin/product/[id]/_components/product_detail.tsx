"use client";

import { IconEye, IconEyeClosed, IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { currencyFormatter } from "~/lib/utils";
import { api } from "~/trpc/react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const ProductDetail = ({ productId }: { productId: string }) => {
  const [data] = api.adminRoute.product.getOne.useSuspenseQuery({
    id: productId,
  });

  const inventory = data?.inventories

  if (inventory === undefined) {
    <div className="flex h-[200px] w-full items-center justify-center rounded-lg border-2 border-dotted px-24 py-4 text-center">
      <div className="text-2xl font-semibold">
        Something wrong on the server
      </div>
    </div>;
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 lg:px-6">
      <div className="w-full max-w-2xl md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="relative grid p-0 sm:grid-cols-2">
              <div className="bg-background/40 absolute top-2 left-2 z-20 flex gap-2 rounded-md p-2">
                {data?.isPublished ? (
                  <>
                    <IconEye /> Published
                  </>
                ) : (
                  <>
                    <IconEyeClosed /> Hidden
                  </>
                )}
              </div>
              <div className="relative">
                <div className="relative aspect-square h-full w-full">
                  <Image
                    src={data?.image ?? ""}
                    alt="Image"
                    fill
                    className="absolute inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between p-6 md:p-8">
                <div>
                  <Badge className="bg-primary/5 text-primary hover:bg-primary/5 text-base shadow-none">
                    {data?.category?.name}
                  </Badge>

                  <h3 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                    {data?.name}
                  </h3>
                  <div className="text-muted-foreground mt-2">
                    <div
                      className="quill-preview"
                      dangerouslySetInnerHTML={{
                        __html: data?.description ?? "",
                      }}
                    ></div>
                  </div>
                  <div className="mt-4 text-lg font-bold md:text-xl">
                    {currencyFormatter.format(Number(data?.price))}
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between gap-4">
                  <div className="text-3xl font-bold">{data?.quantity}</div>
                  <Button size={"lg"}>
                    Add Quantity <IconPlus />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <DataTable columns={columns} data={inventory!} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
