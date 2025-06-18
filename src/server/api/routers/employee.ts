import { createTRPCRouter } from "../trpc";
import { categoryEmployeeRouter } from "./employee/category";
import { clockingRouter } from "./employee/clocking";
import { orderRouter } from "./employee/order";
import { productRouter } from "./employee/product";
import { serviceRouter } from "./employee/service";

export const employeeRouter = createTRPCRouter({
  category: categoryEmployeeRouter,
  product: productRouter,
  service: serviceRouter,
  order: orderRouter,
  clocking: clockingRouter
});
