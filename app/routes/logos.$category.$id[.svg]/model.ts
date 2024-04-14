import { z } from "zod";

export const Logo = z.object({
  contents: z.string(),
});

export type Logo = z.infer<typeof Logo>;
