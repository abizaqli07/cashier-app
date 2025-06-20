export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import InvoicePage from "./_components/invoice";

const InvoiceProductPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  
  void api.employeeRoute.order.getOne.prefetch({
    orderId: id,
  });

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <InvoicePage orderId={id} />
        </div>
      </div>
    </HydrateClient>
  );
};

export default InvoiceProductPage;
