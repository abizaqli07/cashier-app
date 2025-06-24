import { asc, desc, eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { clocking, users } from "~/server/db/schema";
import {
  ChangePasswordSchema,
  RegisterSchema,
  UpdateDataSchema,
  UserIdSchema,
} from "~/server/validator/auth";
import { TRPCError } from "@trpc/server";
import { hash } from "bcryptjs";

export const employeeRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const employees = await ctx.db.query.users.findMany({
      with: {
        clockings: {
          where: (clocking, { isNull }) => isNull(clocking.end),
          orderBy: [desc(clocking.date)],
          limit: 1,
        },
      },
      orderBy: [asc(users.name)],
    });

    return employees;
  }),
  getOne: protectedProcedure
    .input(UserIdSchema)
    .query(async ({ ctx, input }) => {
      const employees = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, input.id),
        with: {
          clockings: true,
        },
      });

      let totalClock = 0;
      
      employees?.clockings.map((data) => {
        totalClock += (data.totalHour??0)
      })

      return {
        employees: employees ?? null,
        totalClock
      };
    }),
  create: protectedProcedure
    .input(RegisterSchema)
    .mutation(async ({ input, ctx }) => {
      const haveUser = await ctx.db.query.users
        .findFirst({
          where: (users, { eq }) => eq(users.email, input.email),
        })
        .execute();

      if (haveUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with same email/username already exist",
        });
      }

      const hashed = await hash(input.password, 10);

      const user = await ctx.db
        .insert(users)
        .values({
          email: input.email,
          password: hashed,
          name: input.name,
          username: input.username,
          role: input.role,
          image: input.image,
          phone: input.phone
        })
        .returning();

      return user;
    }),
  update: protectedProcedure
    .input(UpdateDataSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db
        .update(users)
        .set({
          email: input.email,
          name: input.name,
          username: input.username,
          phone: input.phone,
          image: input.image,
          role: input.role,
          status: input.status,
        })
        .where(eq(users.id, input.id))
        .returning();

      return user;
    }),
  changePassword: protectedProcedure
    .input(ChangePasswordSchema)
    .mutation(async ({ input, ctx }) => {
      const userData = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, input.id),
      });

      if (!userData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User tidak ditemukan",
        });
      }

      const hashed = await hash(input.password, 10);

      try {
        const user = await ctx.db
          .update(users)
          .set({
            password: hashed,
          })
          .where(eq(users.id, input.id))
          .returning();

        return user;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Some error occured, please try again",
          cause: error,
        });
      }
    }),
  delete: protectedProcedure
    .input(UserIdSchema)
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, input.id),
      });

      if (!existed) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User Not Found",
        });
      }

      const deleteUser = await ctx.db
        .delete(users)
        .where(eq(users.id, input.id))
        .returning();

      return deleteUser;
    }),
});
