import { createTRPCRouter } from "../trpc";
import { categoryAdminRouter } from "./admin/category";
import { employeeRouter } from "./admin/employee";

export const adminRouter = createTRPCRouter({
  category: categoryAdminRouter,
  employee: employeeRouter
});