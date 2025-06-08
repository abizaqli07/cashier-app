import { z } from "zod";
import { employmentStatus, userRole } from "../db/schema";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

const roles = userRole.enumValues;

export const UserIdSchema = z.object({
  id: z.string(),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email invalid",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 character",
  }),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "Email invalid",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 character",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 character",
    }),
    name: z.string().min(1, {
      message: "Name required",
    }),
    username: z
      .string()
      .min(4, { message: "Username must be at least 4 char longs" })
      .max(20, { message: "Username cannot exceed 20 characters" })
      .regex(
        /^[a-z0-9]{6,20}$/,
        "Username must not contain special characters or uppercase letters",
      ),
    role: z.enum(roles),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password != confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Password doesnt match",
        path: ["confirmPassword"],
      });
    }
  });

export const UpdateDataSchema = z.object({
  email: z.string().email({
    message: "Email invalid",
  }),
  name: z.string().min(1, {
    message: "Name required",
  }),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 char longs" })
    .max(20, { message: "Username cannot exceed 20 characters" })
    .regex(
      /^[a-z0-9]{6,20}$/,
      "Username must not contain special characters or uppercase letters",
    ),
  phone: z.string().regex(phoneRegex, "Invalid Number!"),
  image: z.string().url().nullable(),
  role: z.enum(roles),
  status: z.enum(employmentStatus.enumValues),
  id: z.string().min(1, {
    message: "ID must be inserted",
  }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email().min(1, {
    message: "Email required",
  }),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string(),
    identifier: z.string(),
    password: z.string().min(8, {
      message: "Password must be at least 8 character",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 character",
    }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password != confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Password doesnt match",
        path: ["confirmPassword"],
      });
    }
  });

export const ChangePasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 character",
  }),
  id: z.string().min(1, {
    message: "ID must be inserted",
  }),
});
