import { desc } from "drizzle-orm";
import { order } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const dashboardRouter = createTRPCRouter({
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const transaction = await ctx.db.query.order.findMany({
      where: (order, { gte }) => gte(order.createdAt, threeMonthsAgo),
      orderBy: [desc(order.createdAt)],
      with: {
        products: true,
        user: true,
      },
    });

    const data = transaction.map((arr) => {
      let sub = 0;
      arr.products.map((product) => {
        sub += product.quantity ?? 0;
      });

      return {
        ...arr,
        countProduct: sub,
      };
    });

    return data;
  }),
  getProductOverview: protectedProcedure.query(async ({ ctx }) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const transaction = await ctx.db.query.order.findMany({
      where: (order, { gte, eq, and }) =>
        and(
          gte(order.createdAt, threeMonthsAgo),
          eq(order.userId, ctx.session.user.id),
        ),
      orderBy: [desc(order.createdAt)],
      with: {
        products: true,
      },
    });

    const data = transaction.map((arr) => {
      let sub = 0;
      arr.products.map((product) => {
        sub += product.quantity ?? 0;
      });

      return {
        ...arr,
        countProduct: sub,
      };
    });

    return data;
  }),
  getCardData: protectedProcedure.query(async ({ ctx }) => {
    // ============= Query and cleaning Data =========== //
    const monthsAgo = new Date();
    const twomonthAgo = new Date();

    monthsAgo.setMonth(monthsAgo.getMonth() - 1);
    twomonthAgo.setMonth(twomonthAgo.getMonth() - 2);

    const recentOrder = await ctx.db.query.order.findMany({
      where: (order, { gte }) => gte(order.createdAt, monthsAgo),
      orderBy: [desc(order.createdAt)],
      with: {
        products: true,
        user: true,
      },
    });

    const twoMonthOrder = await ctx.db.query.order.findMany({
      where: (order, { gte, and, lt }) =>
        and(gte(order.createdAt, twomonthAgo), lt(order.createdAt, monthsAgo)),
      orderBy: [desc(order.createdAt)],
      with: {
        products: true,
        user: true,
      },
    });

    const employees = await ctx.db.query.users.findMany({
      where: (users, { eq }) => eq(users.status, "EMPLOYED"),
    });

    const recentData = recentOrder.map((arr) => {
      let sub = 0;
      arr.products.map((product) => {
        sub += product.quantity ?? 0;
      });

      return {
        ...arr,
        countProduct: sub,
      };
    });

    const twoData = twoMonthOrder.map((arr) => {
      let sub = 0;
      arr.products.map((product) => {
        sub += product.quantity ?? 0;
      });

      return {
        ...arr,
        countProduct: sub,
      };
    });

    // =========== Data for Card 1 ========= //
    let totalRevenue = 0;
    let totalRevenueTwo = 0;

    recentData.map((arr) => {
      totalRevenue += Number(arr.totalPrice);
    });
    twoData.map((arr) => {
      totalRevenueTwo += Number(arr.totalPrice);
    });

    // =========== Data for Card 2 ========= //
    const totalCustomer = recentData.length;
    const totalCustomerTwo = twoData.length;

    // =========== Data for Card 3 ========= //
    let totalProduct = 0;
    let totalProductTwo = 0;

    recentData.map((arr) => {
      totalProduct += arr.countProduct;
      if (arr.serviceId !== null) {
        totalProduct += 1;
      }
    });
    twoData.map((arr) => {
      totalProductTwo += arr.countProduct;
      if (arr.serviceId !== null) {
        totalProductTwo += 1;
      }
    });

    // =========== Data for Card 4 ========= //
    const activeEmployee = employees.length

    return{
      totalRevenue,
      totalRevenueTwo,
      totalCustomer,
      totalCustomerTwo,
      totalProduct,
      totalProductTwo,
      activeEmployee
    }
  }),
});
