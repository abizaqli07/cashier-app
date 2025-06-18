import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { product } from "~/server/db/schema";
import { ProductFilterSchema } from "~/server/validator/product";
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
          where: (product, { ilike, and, eq }) =>
            and(
              input.search
                ? ilike(product.name, `%${input.search}%`)
                : undefined,
              eq(product.isPublished, true),
            ),
        });

        const [total] = await ctx.db
          .select({ count: count() })
          .from(product)
          .where(
            and(
              input.search
                ? ilike(product.name, `%${input.search}%`)
                : undefined,
              eq(product.isPublished, true),
            ),
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
