import { api, HydrateClient } from "~/trpc/server";
import AllTransaction from "./_components/all_transaction";

const CategoryPage = async () => {
  void api.employeeRoute.order.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AllTransaction />
        </div>
      </div>
    </HydrateClient>
  );
};

export default CategoryPage;
