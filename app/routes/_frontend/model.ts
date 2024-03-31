import { z } from "zod";

export const Categories = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);

export type Categories = z.infer<typeof Categories>;
