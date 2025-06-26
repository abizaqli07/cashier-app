/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { IconBuildingStore } from "@tabler/icons-react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { formatTime } from "~/lib/utils";
import { api } from "~/trpc/react";
import { DataTable } from "./data-table";

const EmployeeDetailSection = ({ employeeId }: { employeeId: string }) => {
  const [data] = api.adminRoute.employee.getOne.useSuspenseQuery({
    id: employeeId,
  });

  let storeType;
  if (data.employees?.role === "STOREONE") {
    storeType = "Store 1";
  } else if (data.employees?.role === "STORETWO") {
    storeType = "Store 2";
  } else {
    storeType = "Admin";
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 lg:px-6">
      <div className="w-full max-w-2xl md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="relative grid p-0 sm:grid-cols-2">
              <div className="relative">
                <div className="relative aspect-square h-full w-full">
                  <Image
                    src={
                      data.employees?.image ?? "/images/placeholder_user.webp"
                    }
                    alt="Image"
                    fill
                    className="absolute inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between p-6 md:p-8">
                <div>
                  <Badge className="bg-primary/5 text-primary hover:bg-primary/5 text-base shadow-none">
                    <IconBuildingStore />
                    {storeType}
                  </Badge>

                  <h3 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                    {data.employees?.name}
                  </h3>
                  <div className="text-muted-foreground mt-2 space-y-1">
                    <div>Username : {data.employees?.username}</div>
                    <div>Email : {data.employees?.email}</div>
                    <div>
                      Phone : {data.employees?.phone ?? "No phone number"}
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between gap-4">
                  <div className="text-3xl font-bold">
                    {formatTime(data.totalClock)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <DataTable data={data.employees?.clockings!} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailSection;
