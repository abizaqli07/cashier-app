import { TRPCError } from "@trpc/server";
import { asc, eq } from "drizzle-orm";
import { category } from "~/server/db/schema";
import {
  CategoryIdSchema,
  CreateCategorySchema,
  UpdateCategorySchema,
} from "../../../validator/category";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const categoryAdminRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.query.category.findMany({
      orderBy: [asc(category.name)],
    });

    return categories;
  }),
  create: protectedProcedure
    .input(CreateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const createCategory = await ctx.db
          .insert(category)
          .values(input)
          .returning();
        return createCategory;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Insert failed, something wrong on the server",
          cause: error,
        });
      }
    }),
  update: protectedProcedure
    .input(UpdateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.category
        .findFirst({
          where: (category, { eq }) => eq(category.id, input.id),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category Not Found",
        });
      }

      const categories = await ctx.db
        .update(category)
        .set({
          name: input.name,
        })
        .where(eq(category.id, input.id))
        .returning();

      return categories;
    }),
  delete: protectedProcedure
    .input(CategoryIdSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.category
        .findFirst({
          where: (category, { eq }) => eq(category.id, input.id),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category Not Found",
        });
      }

      const categories = await ctx.db
        .delete(category)
        .where(eq(category.id, input.id))
        .returning();

      return categories;
    }),
});
