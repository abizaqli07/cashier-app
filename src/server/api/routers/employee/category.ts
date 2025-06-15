import { asc } from "drizzle-orm";
import { category } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const categoryEmployeeRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.query.category.findMany({
      orderBy: [asc(category.name)],
    });

    return categories;
  }),
});
