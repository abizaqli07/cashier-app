export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import AllService from "./_components/all_service";

const ServicePage = async () => {
  void api.adminRoute.service.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AllService />
        </div>
      </div>
    </HydrateClient>
  );
};

export default ServicePage;
