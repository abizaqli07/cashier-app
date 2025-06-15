import { api, HydrateClient } from "~/trpc/server";
import AllEmployee from "./_components/all_employee";

const EmployeePage = async () => {
  void api.adminRoute.employee.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AllEmployee />
        </div>
      </div>
    </HydrateClient>
  );
};

export default EmployeePage;
