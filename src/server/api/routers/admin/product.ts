import { TRPCError } from "@trpc/server";
import { count, desc, eq, ilike } from "drizzle-orm";
import { inventory, product } from "~/server/db/schema";
import {
  CreateProductSchema,
  ProductFilterSchema,
  ProductIdSchema,
  ProductQuantitySchema,
  UpdateProductSchema,
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
  getOne: protectedProcedure
    .input(ProductIdSchema)
    .query(async ({ ctx, input }) => {
      try {
        const products = await ctx.db.query.product.findFirst({
          where: (product, { eq }) => eq(product.id, input.id),
          with: {
            category: true,
            inventories: true,
          },
        });

        return products;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something wrong on the server",
          cause: error,
        });
      }
    }),
  create: protectedProcedure
    .input(CreateProductSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const createProduct = await ctx.db
          .insert(product)
          .values(input)
          .returning();
        return createProduct;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Insert failed, something wrong on the server",
          cause: error,
        });
      }
    }),
  update: protectedProcedure
    .input(UpdateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.product
        .findFirst({
          where: (product, { eq }) => eq(product.id, input.id),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product Not Found",
        });
      }

      const products = await ctx.db
        .update(product)
        .set({
          name: input.name,
          description: input.description,
          isPublished: input.isPublished,
          price: input.price,
          categoryId: input.categoryId,
          image: input.image,
        })
        .where(eq(product.id, input.id))
        .returning();

      return products;
    }),
  delete: protectedProcedure
    .input(ProductIdSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.product
        .findFirst({
          where: (product, { eq }) => eq(product.id, input.id),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product Not Found",
        });
      }

      const products = await ctx.db
        .delete(product)
        .where(eq(product.id, input.id))
        .returning();

      return products;
    }),
  addQuantity: protectedProcedure
    .input(ProductQuantitySchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.product
        .findFirst({
          where: (product, { eq }) => eq(product.id, input.id),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product Not Found",
        });
      }

      try {
        let amount = existed.quantity ?? 0;

        if (input.isPlus) {
          amount += input.quantity;
        } else {
          amount -= input.quantity;
        }

        const updateProduct = await ctx.db
          .update(product)
          .set({
            quantity: amount,
          })
          .where(eq(product.id, input.id))
          .returning();

        if (updateProduct) {
          await ctx.db.insert(inventory).values({
            productId: input.id,
            isPlus: input.isPlus,
            amount: input.quantity,
          });
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Insert failed, something wrong on the server",
          cause: error,
        });
      }
    }),
});
