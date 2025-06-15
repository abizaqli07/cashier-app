import { createTRPCRouter } from "../trpc";
import { categoryEmployeeRouter } from "./employee/category";
import { orderRouter } from "./employee/order";
import { productRouter } from "./employee/product";

export const employeeRouter = createTRPCRouter({
  category: categoryEmployeeRouter,
  product: productRouter,
  order: orderRouter,
});
