import { desc, sql } from "drizzle-orm";
import { order } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const dashboardRouter = createTRPCRouter({
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const transaction = await ctx.db.query.order.findMany({
      where: sql`${order.createdAt} >= ${threeMonthsAgo.toISOString()}`,
      orderBy: [desc(order.createdAt)],
      with: {
        products: true,
        user: true
      }
    });

    const data = transaction.map((arr) => {
      let sub = 0;
      arr.products.map((product) => {
        sub += product.quantity ?? 0;
      })

      return {
        ...arr,
        countProduct: sub
      }
    })

    return data;
  }),
});
