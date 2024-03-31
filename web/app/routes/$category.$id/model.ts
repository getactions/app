import { z } from "zod";

export const Workflow = z.object({
  category: z.string(),
  name: z.string(),
  description: z.string(),
  secrets: z.record(
    z.string(),
    z.object({
      description: z.string(),
    }),
  ),
  contents: z.string(),
});

export type Workflow = z.infer<typeof Workflow>;
