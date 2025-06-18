import { z } from "zod";

export const ServiceIdSchema = z.object({
  id: z.string().min(1, {
    message: "Id required for service",
  }),
});

export const ServiceFilterSchema = z.object({
  page: z.number(),
  totalItems: z.number(),
  search: z.string().nullable(),
});

export const CreateServiceSchema = z.object({
  name: z.string().min(1, {
    message: "Name required for service",
  }),
  description: z
    .string()
    .min(1, { message: "Description required for service" }),
  isPublished: z.boolean(),
  price: z.string().min(1, { message: "Price required" }),
});

export const UpdateServiceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, {
    message: "Name required for service",
  }),
  description: z
    .string()
    .min(1, { message: "Description required for service" }),
  isPublished: z.boolean(),
  price: z.string().min(1, { message: "Price required" }),
});
