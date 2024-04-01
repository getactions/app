import { z } from "zod";

export const Workflows = z.array(
  z.object({
    id: z.string(),
    category: z.string(),
    name: z.string(),
    title: z.string(),
    description: z.string(),
  }),
);

export type Workflows = z.infer<typeof Workflows>;
