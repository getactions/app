import { z } from "zod";

export const Workflow = z.object({
  id: z.string(),
  category: z.string(),
  name: z.string(),
  title: z.string(),
  readme: z.string(),
  installCommand: z.string(),
});

export type Workflow = z.infer<typeof Workflow>;
