import { z } from "zod";

export const Model = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});
