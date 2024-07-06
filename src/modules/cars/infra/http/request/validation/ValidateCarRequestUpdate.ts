import { minLength } from '@shared/format/Minimum';
import { z } from 'zod';

export const ZodCarUpdateSchema = z.object({
  model: z
    .string()
    .min(2, { message: "The 'name' field must have at least 2 characters." })
    .refine(minLength(1), { message: "The 'name' field is mandatory." }),

  color: z.string().min(1, { message: "The 'color' field is mandatory." }),

  year: z
    .string()
    .regex(/^\d{4}$/, {
      message: "The 'year' field must be a valid 4-digit year.",
    })
    .refine(
      value =>
        /^\d{4}$/.test(value) &&
        parseInt(value, 10) >= 1950 &&
        parseInt(value, 10) <= 2023,
      { message: "The 'year' field must be between 1950 and 2023." },
    ),

  value_per_day: z.number().positive({
    message: "The 'value_per_day' field must be a positive number.",
  }),

  number_of_passengers: z.number().positive({
    message: "The 'number_of_passengers' field must be a positive number.",
  }),
});
