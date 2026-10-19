import { z } from "zod";

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId");

export const createUserSchema = z.object({
  fullName: z.string().trim().min(1, "fullName is required"),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  phone: z.string().trim().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
});

export const createSessionSchema = z.object({
  teacherId: objectId,
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export const idParamSchema = z.object({ id: objectId });

export const bookSessionSchema = z.object({ userId: objectId });

export const availableQuerySchema = z.object({
  dateTimestamp: z.coerce.number().int().positive(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;