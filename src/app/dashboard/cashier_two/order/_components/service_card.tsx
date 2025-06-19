"use client";

import { format } from "date-fns";
import Image from "next/image";
import PriceFormat from "~/components/ui/price-format";
import { type RouterOutputs } from "~/trpc/react";
import UpdateButton from "./update_button";

interface ServiceCardProps {
  service: RouterOutputs["employeeRoute"]["order"]["getUncomplete"]["orders"][number];
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-md sm:h-[220px] sm:flex-row dark:border-gray-800 dark:bg-gray-900">
      {/* Image section */}
      <div className="relative h-52 w-full bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-6 sm:h-full sm:w-2/5 dark:from-gray-900 dark:via-purple-950/10 dark:to-gray-900">
        {/* New badge */}

        <div className="absolute top-3 left-3 z-10">
          <div className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            {service.service?.name}
          </div>
        </div>

        {/* Background glow effect */}
        <div className="absolute inset-0">
          <div className="absolute -bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 transform rounded-full bg-purple-500/20 blur-2xl"></div>
        </div>

        {/* Image with hover effect */}
        <div className="flex h-full items-center justify-center">
          <div className="h-full w-full transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
            <div className="relative mx-auto h-full w-full rounded-lg drop-shadow-lg">
              <Image
                src={"/images/placeholder_service.webp"}
                alt="Image Placeholder"
                fill
                className="inset-0 z-20 object-cover"
              />
              <div className="dark:bg-background/80 absolute top-0 right-0 bottom-0 left-0 z-30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Product name and description */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {service.name}
              </h3>
              <PriceFormat
                prefix={"Rp "}
                value={parseInt(service.totalPrice)}
                className="text-xl font-bold text-blue-600 dark:text-blue-400"
              />
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
              {format(service.createdAt ?? new Date(), "dd MMMM yyyy")}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-200">
              {service.description}
            </p>
          </div>
        </div>

        {/* Bottom section with availability and buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-x-2">
            <p
              className={`text-xs font-medium ${service.status === "PROCESS" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}
            >
              <span
                className={`mr-1 inline-block h-2 w-2 rounded-full ${service.status === "PROCESS" ? "bg-green-500" : "bg-amber-500"}`}
              ></span>
              {service.status === "PROCESS" ? "Processed" : "Pending"}
            </p>
            <p
              className={`text-xs font-medium ${service.payment === "PAID" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}
            >
              <span
                className={`mr-1 inline-block h-2 w-2 rounded-full ${service.payment === "PAID" ? "bg-green-500" : "bg-amber-500"}`}
              ></span>
              {service.payment === "PAID" ? "Already Paid" : "Pending"}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            <UpdateButton service={service} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
