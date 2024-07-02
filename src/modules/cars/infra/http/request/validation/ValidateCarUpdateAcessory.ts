import { z } from 'zod';

export const ZodCarUpdateAccessorySchema = z.object({
  description: z.string().min(1, {
    message: 'Accessory description is mandatory.',
  }),
});
