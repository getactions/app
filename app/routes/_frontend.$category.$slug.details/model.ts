import { z } from "zod";

const Category = z.object({ id: z.string(), name: z.string() });

const Workflow = z.object({
  id: z.string(),
  category: z.string(),
  name: z.string(),
  description: z.string(),
  title: z.string(),
  readme: z.string(),
  installCommand: z.string(),
  source: z.string(),
});

export const Model = z.object({
  currentCategory: Category,
  categories: z.array(Category),
  currentWorkflow: Workflow,
  otherWorkflowsInCurrentCategory: z.array(
    Workflow.pick({
      id: true,
      title: true,
    }),
  ),
});

export type Model = z.infer<typeof Model>;
