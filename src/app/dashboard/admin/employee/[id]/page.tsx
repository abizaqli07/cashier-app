export const dynamic = "force-dynamic";

import { api, HydrateClient } from "~/trpc/server";
import EmployeeDetailSection from "./_components/employee_detail";

const EmployeeDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  void api.adminRoute.employee.getOne.prefetch({
    id,
  });

  return (
    <HydrateClient>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <EmployeeDetailSection employeeId={id} />
        </div>
      </div>
    </HydrateClient>
  );
};

export default EmployeeDetailPage;
