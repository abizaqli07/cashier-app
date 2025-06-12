import { z } from "zod";

export const ProductIdSchema = z.object({
  id: z.string().min(1, {
    message: "Id required for product action",
  }),
});

export const ProductFilterSchema = z.object({
  page: z.number(),
  totalItems: z.number(),
  search: z.string().nullable()
});

export const CreateProductSchema = z.object({
  name: z.string().min(1, {
    message: "Name required for product",
  }),
  description: z
    .string()
    .min(1, { message: "Description required for product" }),
  isPublished: z.boolean(),
  image: z.string().url().nullable(),
  price: z.string().min(1, { message: "Price required" }),
  categoryId: z.string().min(1, { message: "Category required" }),
});
