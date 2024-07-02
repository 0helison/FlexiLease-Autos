import { customDateValidation } from '@shared/format/FormatDate';
import { minLength } from '@shared/format/Minimum';
import { z } from 'zod';

export const ZodUserSchema = z.object({
  name: z
    .string()
    .min(3, { message: "The 'name' field must have at least 3 characters." })
    .max(50, {
      message: "The 'name' field must have a maximum of 50 characters.",
    })
    .refine(minLength(1), { message: "The 'name' field is mandatory." }),

  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
      message: "The 'cpf' field must be in the format '000.000.000-00'.",
    })
    .refine(minLength(1), { message: "The 'cpf' field is mandatory." }),

  birthday: z
    .string()
    .refine(customDateValidation, {
      message:
        "The 'birthday' field must contain a valid date in the format DD/MM/YYYY.",
    })
    .refine(minLength(1), { message: "The 'birthday' field is mandatory." }),

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

  qualified: z.enum(['yes', 'no']).refine(minLength(1), {
    message: "The 'qualified' field is mandatory and must be 'yes' or 'no'.",
  }),

  cep: z
    .string()
    .regex(/^\d{5}-\d{3}$/, {
      message: "The 'cep' field must be in the format '00000-000'.",
    })
    .refine(minLength(1), { message: "The 'cep' field is mandatory." }),
});
