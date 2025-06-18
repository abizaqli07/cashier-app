"use client";

import { api } from "~/trpc/react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const AllClocking = () => {
  const [data] = api.employeeRoute.clocking.getAll.useSuspenseQuery();

  return (
    <div className="px-4 lg:px-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default AllClocking;
