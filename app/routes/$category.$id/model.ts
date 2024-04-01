import { z } from "zod";

export const Workflow = z.object({
  id: z.string(),
  filename: z.string(),
  category: z.string(),
  name: z.string(),
  description: z.string(),
  secrets: z.record(
    z.string(),
    z.object({
      description: z.string(),
    }),
  ),
  parameters: z
    .record(
      z.string(),
      z.object({
        description: z.string(),
      }),
    )
    .optional(),

  contents: z.string(),
});

export type Workflow = z.infer<typeof Workflow>;
