import { TRPCError } from "@trpc/server";
import { count, desc, ilike } from "drizzle-orm";
import { product } from "~/server/db/schema";
import {
  ProductFilterSchema
} from "~/server/validator/product";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const productRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(ProductFilterSchema)
    .query(async ({ ctx, input }) => {
      try {
        const offset = (input.page - 1) * input.totalItems;
        const limit = input.totalItems;

        const products = await ctx.db.query.product.findMany({
          orderBy: [desc(product.createdAt)],
          offset: offset,
          limit: limit,
          with: {
            category: true,
          },
          where: (product, { ilike }) =>
            input.search ? ilike(product.name, `%${input.search}%`) : undefined,
        });

        const [total] = await ctx.db
          .select({ count: count() })
          .from(product)
          .where(
            input.search ? ilike(product.name, `%${input.search}%`) : undefined,
          );

        const totalPages = Math.ceil((total?.count ?? 1) / limit);

        return {
          products,
          totalPages,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something wrong on the server",
          cause: error,
        });
      }
    }),
});
