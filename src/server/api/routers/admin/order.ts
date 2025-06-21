import { desc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { order } from "~/server/db/schema";
import { OrderIdSchema } from "~/server/validator/order";
import { TRPCError } from "@trpc/server";

export const orderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const transactions = await ctx.db.query.order.findMany({
      orderBy: [desc(order.createdAt)],
      with: {
        user: true,
      },
    });

    return transactions;
  }),
  getOne: protectedProcedure
    .input(OrderIdSchema)
    .query(async ({ ctx, input }) => {
      try {
        const oneOrder = await ctx.db.query.order.findFirst({
          where: (order, { eq }) => eq(order.id, input.orderId),
          with: {
            products: {
              with: {
                product: true,
              },
            },
            service: true,
          },
        });

        return oneOrder;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something wrong on the server",
          cause: error,
        });
      }
    }),
});
