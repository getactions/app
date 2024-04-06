import { z } from "zod";

export const Model = z.object({
  id: z.string(),
  category: z.object({ id: z.string(), name: z.string() }),
  title: z.string(),
  installCommand: z.string(),
});
