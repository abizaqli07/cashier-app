import { string, z } from "zod";

export const CategoryIdSchema = z.object({
  id: string().min(1, {
    message: "Id required for category",
  }),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(1, {
    message: "Name required for category",
  }),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(1, {
    message: "Name required for category",
  }),
  id: string(),
});
