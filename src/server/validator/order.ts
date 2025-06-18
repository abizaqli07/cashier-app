import { z } from "zod";
import { orderStatus, paymentStatus } from "../db/schema";

export const CreateOrderSchema = z.object({
  name: z.string().min(1, {
    message: "Name required for product",
  }),
  status: z.enum(orderStatus.enumValues).default("PROCESS"),
  payment: z.enum(paymentStatus.enumValues).default("PENDING"),
  totalPrice: z.string().min(1, { message: "Total price required" }),
  method: z.string().min(1, { message: "Payment method required" }),
  serviceId: z.string().nullable(),
  products: z
    .object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
      imageUrl: z.string(),
    })
    .array(),
});

export const CreateOrderServiceSchema = z.object({
  name: z.string().min(1, {
    message: "Name required for product",
  }),
  status: z.enum(orderStatus.enumValues),
  payment: z.enum(paymentStatus.enumValues),
  totalPrice: z.string().min(1, { message: "Total price required" }),
  serviceId: z.string(),
});
