export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import AllClocking from "./_components/all_clocking";

const ClockingStoreTwoPage = async () => {
  void api.employeeRoute.clocking.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AllClocking />
        </div>
      </div>
    </HydrateClient>
  );
};

export default ClockingStoreTwoPage;
