import { createTRPCRouter } from "../trpc";
import { categoryAdminRouter } from "./admin/category";
import { employeeRouter } from "./admin/employee";
import { productRouter } from "./admin/product";
import { serviceRouter } from "./admin/service";

export const adminRouter = createTRPCRouter({
  category: categoryAdminRouter,
  employee: employeeRouter,
  service: serviceRouter,
  product: productRouter
});