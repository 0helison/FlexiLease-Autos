import { z } from 'zod';

const minLength = (min: number) => (value: string) => value.length >= min;

export const ZodAuthSchema = z.object({
  email: z
    .string()
    .email({ message: "The 'email' field must contain a valid email address." })
    .refine(minLength(1), { message: "The 'email' field is mandatory." }),

  password: z
    .string()
    .min(6, {
      message: "The 'password' field must have at least 6 characters.",
    })
    .refine(minLength(1), { message: "The 'password' field is mandatory." }),
});
