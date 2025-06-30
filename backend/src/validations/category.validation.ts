// File: src/validations/category.validation.ts

import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'Name is required'),
});
