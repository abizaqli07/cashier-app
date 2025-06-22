export const dynamic = "force-dynamic";

import { api } from "~/trpc/server";
import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { DataTable } from "./_components/data-table";

export default async function StoreOneDashboardPage() {
  void api.dashboard.getProductOverview.prefetch();

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable />
      </div>
    </div>
  );
}
