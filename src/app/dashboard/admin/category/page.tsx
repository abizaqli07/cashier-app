import AllCategory from "./_components/all_category";
import { api, HydrateClient } from "~/trpc/server";

const CategoryPage = async () => {
  void api.adminRoute.category.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AllCategory />
        </div>
      </div>
    </HydrateClient>
  );
};

export default CategoryPage;
