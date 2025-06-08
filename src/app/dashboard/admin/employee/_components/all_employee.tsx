"use client";

import { api } from "~/trpc/react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const AllEmployee = () => {
  const [data] = api.adminRoute.employee.getAll.useSuspenseQuery();

  return (
    <div className="px-4 lg:px-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default AllEmployee;
