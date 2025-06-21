"use client";

import { IconCashRegister, IconFileDownload } from "@tabler/icons-react";
import { format } from "date-fns";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { currencyFormatter } from "~/lib/utils";
import { api } from "~/trpc/react";

interface InvoicePageInterface {
  orderId: string;
}

const InvoicePage = ({ orderId }: InvoicePageInterface) => {
  const ref = useRef(null);
  const [data] = api.adminRoute.order.getOne.useSuspenseQuery({
    orderId: orderId,
  });

  const handleDownload = async () => {
    const content = ref.current;
    if (!content) {
      return;
    }

    const canvas = await html2canvas(content, {
      scale: 2,
    });
    const data = canvas.toDataURL();

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
      
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Invoice.pdf");
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      <div className="flex py-4">
        <Button variant={"outline"} onClick={() => handleDownload()}>
          <IconFileDownload />
          Save to PDF
        </Button>
      </div>
      <div className="h-full w-full overflow-x-auto">
        <div
          ref={ref}
          className="bg-background h-full w-[calc(672px_-_32px)] rounded-lg border-[1px] border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <IconCashRegister className="size-8" />
              <h1 className="text-2xl font-bold">Cashier Inc.</h1>
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Invoice #INV{String(data?.invoiceId).padStart(5, "0")}
              </h2>
              <p className="text-gray-500">
                Date: {format(data?.createdAt ?? new Date(), "dd/MM/yyyy")}
              </p>
            </div>
          </div>
          <main className="p-6">
            <Card>
              <CardContent>
                <div className="mb-4 font-semibold">Bill to :</div>
                <p className="font-medium">{data?.name}</p>
                <p className="text-gray-400">
                  {data?.description ?? "Buy product on store 1"}
                </p>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.products.map((product) => {
                      const totalPrice =
                        (product.quantity ?? 0) * Number(product.product.price);
                      return (
                        <TableRow key={product.productId}>
                          <TableCell>{product.product.name}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            {currencyFormatter.format(
                              Number(product.product.price),
                            )}
                          </TableCell>
                          <TableCell>
                            {currencyFormatter.format(totalPrice)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {data?.service && (
                      <TableRow>
                        <TableCell>{data.service.name}</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>
                          {currencyFormatter.format(Number(data.service.price))}
                        </TableCell>
                        <TableCell>
                          {currencyFormatter.format(Number(data.service.price))}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center">
                  <div>Subtotal</div>
                  <div className="ml-auto">
                    {currencyFormatter.format(Number(data?.totalPrice))}
                  </div>
                </div>
                <div className="flex items-center">
                  <div>Taxes (0%)</div>
                  <div className="ml-auto">Rp 0</div>
                </div>
                <Separator />
                <div className="flex items-center font-medium">
                  <div>Total</div>
                  <div className="ml-auto">
                    {currencyFormatter.format(Number(data?.totalPrice))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
