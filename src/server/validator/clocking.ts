import { z } from "zod";

export const StartClockingSchema = z.object({
  start: z.date(),
  date: z.date(),
});

export const StopClockingSchema = z.object({
  stop: z.date(),
  totalHour: z.number(),
  clockId: z.string().nullish(),
});
