import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { order, product, productToOrder } from "~/server/db/schema";
import {
  CreateOrderSchema,
  CreateOrderServiceSchema,
  OrderIdSchema,
  UpdateOrderServiceSchema,
} from "~/server/validator/order";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ServiceFilterSchema } from "~/server/validator/service";

export const orderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const transactions = await ctx.db.query.order.findMany({
      orderBy: [desc(order.createdAt)],
      where: (order, { eq }) => eq(order.userId, ctx.session.user.id),
    });

    return transactions;
  }),
  getUncomplete: protectedProcedure
    .input(ServiceFilterSchema)
    .query(async ({ ctx, input }) => {
      try {
        const offset = (input.page - 1) * input.totalItems;
        const limit = input.totalItems;

        const orders = await ctx.db.query.order.findMany({
          orderBy: [desc(order.createdAt)],
          with: {
            service: true,
          },
          offset: offset,
          limit: limit,
          where: (order, { ilike, and, eq, or }) =>
            and(
              input.search ? ilike(order.name, `%${input.search}%`) : undefined,
              and(
                eq(order.userId, ctx.session.user.id),
                or(eq(order.status, "PROCESS"), eq(order.status, "PENDING")),
              ),
            ),
        });

        const [total] = await ctx.db
          .select({ count: count() })
          .from(order)
          .where(
            and(
              input.search ? ilike(order.name, `%${input.search}%`) : undefined,
              and(
                eq(order.userId, ctx.session.user.id),
                or(eq(order.status, "PROCESS"), eq(order.status, "PENDING")),
              ),
            ),
          );

        const totalPages = Math.ceil((total?.count ?? 1) / limit);

        return {
          orders,
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
  orderProduct: protectedProcedure
    .input(CreateOrderSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const createOrderProduct = await ctx.db
          .insert(order)
          .values({
            name: input.name,
            totalPrice: input.totalPrice,
            method: input.method,
            payment: input.payment,
            status: input.status,
            userId: ctx.session.user.id,
          })
          .returning();

        const orderId = createOrderProduct[0]?.id;

        if (orderId !== undefined) {
          for (const data of input.products) {
            const exist = await ctx.db.query.product
              .findFirst({
                where: (product, { eq }) => eq(product.id, data.id),
              })
              .execute();

            const finalQuantity = (exist?.quantity ?? 0) - data.quantity;

            if (exist) {
              await ctx.db
                .update(product)
                .set({
                  quantity: finalQuantity,
                })
                .where(eq(product.id, exist.id));

              await ctx.db.insert(productToOrder).values({
                orderId: orderId,
                productId: exist.id,
                quantity: data.quantity
              });
            }
          }
        }

        return createOrderProduct;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Insert failed, something wrong on the server",
          cause: error,
        });
      }
    }),
  orderService: protectedProcedure
    .input(CreateOrderServiceSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const createOrderService = await ctx.db
          .insert(order)
          .values({
            name: input.name,
            description: input.description,
            image: input.image,
            totalPrice: input.totalPrice,
            payment: input.payment,
            status: input.status,
            userId: ctx.session.user.id,
            serviceId: input.serviceId,
          })
          .returning();

        return createOrderService;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Insert failed, something wrong on the server",
          cause: error,
        });
      }
    }),
  updateOrder: protectedProcedure
    .input(UpdateOrderServiceSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const existed = await ctx.db.query.order
          .findFirst({
            where: (order, { eq }) => eq(order.id, input.orderId),
          })
          .execute();

        if (!existed) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order Not Found",
          });
        }

        const orders = await ctx.db
          .update(order)
          .set({
            payment: input.payment,
            status: input.status,
            method: input.method,
          })
          .where(eq(order.id, input.orderId))
          .returning();

        return orders;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Insert failed, something wrong on the server",
          cause: error,
        });
      }
    }),
});
