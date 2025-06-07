import { createTRPCRouter } from "../trpc";
import { categoryAdminRouter } from "./admin/category";

export const adminRouter = createTRPCRouter({
  category: categoryAdminRouter
});