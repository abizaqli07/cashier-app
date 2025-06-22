"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { currencyFormatter } from "~/lib/utils";
import { api } from "~/trpc/react";

export function SectionCards() {
  const [data] = api.dashboard.getCardData.useSuspenseQuery();

  let revenuePercent = 0;
  if (data.totalRevenueTwo !== 0) {
    revenuePercent =
      ((data.totalRevenue - data.totalRevenueTwo) / data.totalRevenueTwo) * 100;
  }

  let customerPercent = 0;
  if (data.totalCustomerTwo !== 0) {
    customerPercent =
      ((data.totalCustomer - data.totalCustomerTwo) / data.totalCustomerTwo) *
      100;
  }

  let productPercent = 0;
  if (data.totalProductTwo !== 0) {
    productPercent =
      ((data.totalProduct - data.totalProductTwo) / data.totalProductTwo) * 100;
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currencyFormatter.format(data.totalRevenue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {data.totalRevenue > data.totalRevenueTwo ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {revenuePercent}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data.totalRevenue > data.totalRevenueTwo ? (
              <>
                Trending up this month <IconTrendingUp className="size-4" />
              </>
            ) : (
              <>
                Trending down this period{" "}
                <IconTrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">Revenue last months</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.totalCustomer}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {data.totalCustomer > data.totalCustomerTwo ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {customerPercent}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data.totalCustomer > data.totalCustomerTwo ? (
              <>
                Strong user retention <IconTrendingUp className="size-4" />
              </>
            ) : (
              <>
                Weak user retention <IconTrendingUp className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Product Sold</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.totalProduct}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {data.totalProduct > data.totalProductTwo ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {productPercent}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {data.totalProduct > data.totalProductTwo ? (
              <>
                Trending up this month <IconTrendingUp className="size-4" />
              </>
            ) : (
              <>
                Trending down this period{" "}
                <IconTrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            Product and service sold last month
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Employee</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.activeEmployee}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Employee woorking on store
          </div>
          <div className="text-muted-foreground">Need attention</div>
        </CardFooter>
      </Card>
    </div>
  );
}
