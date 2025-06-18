import { asc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { service } from "~/server/db/schema";

export const serviceRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const services = await ctx.db.query.service.findMany({
      orderBy: [asc(service.name)],
      where: (service, { eq }) => eq(service.isPublished, true),
    });

    return services;
  }),
});
