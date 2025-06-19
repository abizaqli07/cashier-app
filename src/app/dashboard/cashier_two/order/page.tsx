export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import AllOrder from "./_components/all_order";

const OrderStoreTwoPage = async () => {
  void api.employeeRoute.service.getAll.prefetch();
  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AllOrder />
        </div>
      </div>
    </HydrateClient>
  );
};

export default OrderStoreTwoPage;
