import { desc, eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { service } from "~/server/db/schema";
import {
  CreateServiceSchema,
  ServiceIdSchema,
  UpdateServiceSchema,
} from "~/server/validator/service";
import { TRPCError } from "@trpc/server";

export const serviceRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const services = await ctx.db.query.service.findMany({
      orderBy: [desc(service.createdAt)],
    });

    return services;
  }),
  create: protectedProcedure
    .input(CreateServiceSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const createService = await ctx.db
          .insert(service)
          .values(input)
          .returning();
        return createService;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Insert failed, something wrong on the server",
          cause: error,
        });
      }
    }),
  update: protectedProcedure
    .input(UpdateServiceSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.service
        .findFirst({
          where: (service, { eq }) => eq(service.id, input.id),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service Not Found",
        });
      }

      const services = await ctx.db
        .update(service)
        .set({
          name: input.name,
          description: input.description,
          isPublished: input.isPublished,
          price: input.price,
        })
        .where(eq(service.id, input.id))
        .returning();

      return services;
    }),
  delete: protectedProcedure
    .input(ServiceIdSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.service
        .findFirst({
          where: (service, { eq }) => eq(service.id, input.id),
        })
        .execute();

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service Not Found",
        });
      }

      const services = await ctx.db
        .delete(service)
        .where(eq(service.id, input.id))
        .returning();

      return services;
    }),
});
