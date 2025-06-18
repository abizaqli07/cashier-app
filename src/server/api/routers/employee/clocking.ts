import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { clocking } from "~/server/db/schema";
import {
  StartClockingSchema,
  StopClockingSchema,
} from "~/server/validator/clocking";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const clockingRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const getClockings = await ctx.db.query.clocking
      .findMany({
        where: (clocking, { eq }) => eq(clocking.userId, ctx.session.user.id),
        orderBy: [desc(clocking.date)],
      })
      .execute();

    return getClockings;
  }),
  getOne: protectedProcedure.query(async ({ ctx }) => {
    const getClocking = await ctx.db.query.clocking
      .findFirst({
        where: (clocking, { eq }) => eq(clocking.userId, ctx.session.user.id),
        orderBy: [desc(clocking.date)],
      })
      .execute();

    const isStopping = getClocking === undefined || getClocking?.end !== null;

    return {
      data: getClocking,
      isStopping: isStopping,
    };
  }),
  startClock: protectedProcedure
    .input(StartClockingSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const inputStartClock = await ctx.db
          .insert(clocking)
          .values({
            start: input.start,
            date: input.date,
            userId: ctx.session.user.id,
          })
          .returning();
        return inputStartClock;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Clock failed, something wrong on the server",
          cause: error,
        });
      }
    }),
  stopClock: protectedProcedure
    .input(StopClockingSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.clockId) {
          const getClocking = await ctx.db.query.clocking
            .findFirst({
              where: (clocking, { eq }) =>
                eq(clocking.userId, ctx.session.user.id),
              orderBy: [desc(clocking.date)],
            })
            .execute();

          const updateClock = await ctx.db
            .update(clocking)
            .set({
              end: input.stop,
              totalHour: input.totalHour,
            })
            .where(eq(clocking.id, getClocking?.id ?? ""))
            .returning();

          return updateClock;
        } else {
          const updateClock = await ctx.db
            .update(clocking)
            .set({
              end: input.stop,
              totalHour: input.totalHour,
            })
            .where(eq(clocking.id, input.clockId))
            .returning();

          return updateClock;
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Clock failed, something wrong on the server",
          cause: error,
        });
      }
    }),
});
