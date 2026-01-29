import { z } from 'zod/v4';

export const username = z
  .string()
  .min(3)
  .max(30)
  .regex(/^[a-zA-Z0-9_]+$/);
