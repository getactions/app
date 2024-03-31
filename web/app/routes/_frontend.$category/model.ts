import { z } from "zod";

export const Workflows = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
  }),
);

export type Workflows = z.infer<typeof Workflows>;
