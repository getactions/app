import { findById } from "~/utils/workflows.server";
import { err, ok } from "neverthrow";
import { Workflow } from "./model";

export async function getWorkflow(id: string) {
  const workflow = await findById(id);

  if (!workflow) {
    return ok(undefined);
  }

  const model = Workflow.safeParse({
    id: workflow.id,
    filename: workflow.filename,
    category: workflow.category,
    name: workflow.name,
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
