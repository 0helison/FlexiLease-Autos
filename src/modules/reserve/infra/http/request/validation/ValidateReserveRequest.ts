import { isValid, parse } from 'date-fns';
import { z } from 'zod';

const customDateValidation = (date: string): boolean => {
  const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
  return isValid(parsedDate);
};

const minLength = (min: number) => (value: string) => value.length >= min;

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
