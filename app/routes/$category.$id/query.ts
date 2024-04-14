import { err, ok } from "neverthrow";
import { findById } from "~/utils/workflows.server";
import { Workflow } from "./model";

export async function getWorkflow(id: string) {
  const workflow = await findById(id);

  if (!workflow) {
    return ok(undefined);
  }

  const model = Workflow.safeParse({
    id: workflow.id,
    name: workflow.name,
    category: workflow.category,
    description: workflow.description,
    secrets: workflow.secrets,
    parameters: workflow.parameters,
    contents: workflow.contents,
  });

  if (!model.success) {
    return err(model.error);
  }

  return ok(model.data);
}
