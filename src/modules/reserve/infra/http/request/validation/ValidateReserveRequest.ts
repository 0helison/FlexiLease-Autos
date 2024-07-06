import { customDateValidation } from '@shared/format/FormatDate';
import { minLength } from '@shared/format/Minimum';
import { z } from 'zod';

export const ZodReserveSchema = z.object({
  _id_user: z
    .string()
    .refine(minLength(1), { message: "The '_id_user' field is mandatory." }),

  _id_car: z
    .string()
    .refine(minLength(1), { message: "The '_id_car' field is mandatory." }),

  start_date: z
    .string()
    .refine(customDateValidation, {
      message:
        "The 'start_date' field must contain a valid date in the format DD/MM/YYYY.",
    })
    .refine(minLength(1), { message: "The 'start_date' field is mandatory." }),

  end_date: z
    .string()
    .refine(customDateValidation, {
      message:
        "The 'end_date' field must contain a valid date in the format DD/MM/YYYY.",
    })
    .refine(minLength(1), { message: "The 'end_date' field is mandatory." }),
});
